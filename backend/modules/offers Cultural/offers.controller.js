import Offers from './offers.model.js';

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