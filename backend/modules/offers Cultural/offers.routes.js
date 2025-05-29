import express from 'express';
import { createOffer, getOffersByUserId, getOfferById, updateOffer, getOffers, deleteOffer,getOffersByPartnerId } from './offers.controller.js';
import { verifyToken } from "../../middleware/verifyToken.js";
import {upload} from "../../middleware/upload.js"

const router = express.Router();

router.post('/createOffer', upload.single('filename'), verifyToken,createOffer);
router.get('/getOffers', verifyToken, getOffers);
router.get('/getOffersByUserId/:id', verifyToken, getOffersByUserId);
router.get('/:id', verifyToken, getOfferById);
router.put('/edit/:id', upload.single('filename'), verifyToken, updateOffer);
router.delete('/delete/:id', verifyToken, deleteOffer);
router.get(
    "/partner/:partnerId",      
    getOffersByPartnerId
  );
export default router;