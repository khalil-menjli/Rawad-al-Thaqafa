import Offers from './offers.model.js';
import Reservation from './Reservation.model.js';
import AccountModels from '../../model/account.model.js';

const { Account, User } = AccountModels;

export const getOffers = async (req, res) => {
    try {
      // Fetch offers and populate the createdBy field
      const offers = await Offers.find()
        .populate('createdBy', 'firstName lastName email')
        .sort({ createdAt: -1 });
      
      res.status(200).json({ data: offers });
    } catch (error) {
      console.error('Error fetching offers:', error);
      res.status(500).json({ message: 'Failed to fetch offers' });
    }
};

export const getOfferById = async (req, res) => {
    try {
        const offer = await Offers.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email title');
            
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(200).json({ data: offer } );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOffersByUserId = async (req, res) => {
    try {
        const offers = await Offers.find({ createdBy: req.userId })
            .populate('createdBy', 'firstName lastName email title');
            console.log(offers);
            
       
        res.status(200).json({ data: offers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rest of the controller methods remain the same
export const createOffer = async (req, res) => {
    const { title, description, price, dateStart, location, categories } = req.body;
    const file = req.file;
    const imageUrl = `uploads/${file.filename}`
    try {
        const newOffer = new Offers({
            title,
            description,
            imageUrl,
            price,
            createdBy: req.userId,
            dateStart: new Date(dateStart),
            location,
            categories
        });
        await newOffer.save();
        res.status(201).json(
            {success: true,
            message: 'Create successful', 
            newOffer});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOffer = async (req, res) => {
    try {
        const { title, description, price, location, dateStart, categories } = req.body;
        
        // Build update object - only include fields that are provided
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (location) updateData.location = location;
        if (dateStart) updateData.dateStart = new Date(dateStart);
        if (categories) updateData.categories = categories;
        
        // Handle image update if new file is uploaded
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }
        // Important: Don't set imageUrl to empty string if no new file is uploaded
        // This preserves the existing image

        const updatedOffer = await Offers.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('createdBy', 'firstName lastName email');

        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Offer updated successfully',
            data: updatedOffer
        });
    } catch (error) {
        console.error('Error updating offer:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        const deletedOffer = await Offers.findByIdAndDelete(req.params.id);
        if (!deletedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOffersByPartnerId = async (req, res) => {
    const { partnerId } = req.params;
  
    try {
      const offers = await Offers.find({ createdBy: partnerId })
        .populate("createdBy", "firstName lastName email")
        .sort({ createdAt: -1 });
  
      return res.status(200).json({ data: offers });
    } catch (error) {
      console.error("Error fetching offers by partner:", error);
      return res.status(500).json({ message: "Failed to fetch offers" });
    }
};

// NEW: Check if user already has reservation for this offer
export const checkReservationStatus = async (req, res) => {
    console.log('🚀 checkReservationStatus function called!');
    console.log('📍 Request URL:', req.originalUrl);
    console.log('📍 Request method:', req.method);
    console.log('📍 Request params:', req.params);
    
    try {
        const userId = req.userId;
        const { offerId } = req.params;

        console.log('🔍 checkReservationStatus called with:', { userId, offerId });

        // Validate offerId format (MongoDB ObjectId)
        if (!offerId || !offerId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('❌ Invalid offer ID format:', offerId);
            return res.status(400).json({ message: 'Invalid offer ID format' });
        }

        // Check if user already has a reservation for this offer
        const existingReservation = await Reservation.findOne({
            user: userId,
            offer: offerId
        });

        console.log('📋 Existing reservation:', existingReservation ? 'Found' : 'Not found');

        // Get user's points - Use Account.findById instead of User.findById
        const user = await Account.findById(userId).select('points');
        if (!user) {
            console.log('❌ User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('👤 User found with points:', user.points);

        // Get offer details to check price
        const offer = await Offers.findById(offerId);
        if (!offer) {
            console.log('❌ Offer not found:', offerId);
            return res.status(404).json({ message: 'Offer not found' });
        }

        console.log('🎯 Offer found:', { title: offer.title, price: offer.price });

        // Parse price to get numeric value (assuming price format like "100 points" or just "100")
        const offerPoints = parseInt(offer.price.toString().replace(/\D/g, '')) || 0;

        const response = {
            hasReservation: !!existingReservation,
            userPoints: user.points || 0,
            offerPoints: offerPoints,
            canReserve: !existingReservation && (user.points || 0) >= offerPoints,
            reservationId: existingReservation?._id || null
        };

        console.log('✅ Sending response:', response);

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error checking reservation status:', error);
        res.status(500).json({ message: 'Failed to check reservation status' });
    }
};

// Create a new reservation for the authenticated user - UPDATED with points check
export const createReservation = async (req, res) => {
  try {
    const userId = req.userId;
    const { offerId } = req.params;

    // Check if user already has a reservation for this offer
    const existingReservation = await Reservation.findOne({
      user: userId,
      offer: offerId
    });

    if (existingReservation) {
      return res.status(400).json({ 
        message: 'You have already reserved this offer',
        reservationId: existingReservation._id
      });
    }

    // Get user details to check points
    const user = await Account.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify offer exists
    const offer = await Offers.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Parse offer price to get points needed
    const offerPoints = offer.price || 0;
    const userPoints = user.points || 0;

    // Check if user has enough points
    if (userPoints < offerPoints) {
      return res.status(400).json({ 
        message: `Insufficient points. You have ${userPoints} points but need ${offerPoints} points.`,
        userPoints,
        requiredPoints: offerPoints
      });
    }

    // Optional: check availability/count
    if (offer.reservation <= 0) {
      return res.status(400).json({ message: 'No more spots available' });
    }

    // Create reservation
    const reservation = new Reservation({
      user: userId,
      offer: offerId,
      category: offer.categories
    });
    await reservation.save();

    // Deduct points from user
    user.points = userPoints - offerPoints;
    await user.save();

    // Decrement available reservations on the offer
    offer.reservation -= 1;
    await offer.save();

    res.status(201).json({ 
      success: true, 
      data: reservation,
      message: `Reservation successful! ${offerPoints} points deducted.`,
      remainingPoints: user.points
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Failed to create reservation' });
  }
};

// Get all reservations for the authenticated user
export const getMyReservations = async (req, res) => {
  try {
    const userId = req.userId;
    const reservations = await Reservation.find({ user: userId })
      .populate({
        path: 'offer',
        select: 'title description price imageUrl dateStart',
        populate: { path: 'createdBy', select: 'firstName lastName email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
};