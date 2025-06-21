import express from 'express';
import { 
  createOffer, 
  getOffersByUserId, 
  getOfferById, 
  updateOffer, 
  getOffers, 
  deleteOffer, 
  getOffersByPartnerId, 
  createReservation, 
  getMyReservations,
  checkReservationStatus  // NEW import
} from './offers.controller.js';
import { verifyToken } from "../../middleware/verifyToken.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

// IMPORTANT: Put specific routes BEFORE generic ones
router.post('/createOffer', upload.single('filename'), verifyToken, createOffer);
router.get('/getOffers', getOffers);
router.get('/getOffersByUserId/:id', verifyToken, getOffersByUserId);
router.get('/partner/:partnerId', getOffersByPartnerId);

// NEW: Reservation routes - PUT THESE BEFORE THE GENERIC /:id ROUTE
router.get('/res/status/:offerId', verifyToken, checkReservationStatus);
router.post('/res/:offerId', verifyToken, createReservation);
router.get('/res/my', verifyToken, getMyReservations);

// Generic routes should come LAST
router.get('/:id', getOfferById);  // This should be last because it catches everything
router.put('/edit/:id', upload.single('filename'), verifyToken, updateOffer);
router.delete('/delete/:id', verifyToken, deleteOffer);

export default router;