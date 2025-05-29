// controllers/partnerController.js
import  models  from '../../model/account.model.js';


const {Partner} = models;
// Delete partner by ID
export const deletePartner = async (req, res, next) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Partner deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// Get unapproved partners
export const getPartnersIsNotApproved = async (req, res, next) => {
  try {
    const partners = await Partner.find({ isApproved: false }).select('-password');
    res.status(200).json({ success: true, partners });
  } catch (err) {
    next(err);
  }
};

// Get approved partners
export const getPartnersIsApproved = async (req, res, next) => {
  try {
    const partners = await Partner.find({ isApproved: true }).select('-password');
    res.status(200).json({ success: true, partners });
  } catch (err) {
    next(err);
  }
};

// Approve partner
export const approvePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner || partner.role !== 'Partner') {
      return res.status(404).json({
        success: false,
        message: 'Partner not found.'
      });
    }

    partner.isApproved = true;
    await partner.save();

    const safe = partner.toObject();
    delete safe.password;

    res.status(200).json({
      success: true,
      message: 'Partner approved.',
      partner: safe
    });
  } catch (err) {
    next(err);
  }
};

