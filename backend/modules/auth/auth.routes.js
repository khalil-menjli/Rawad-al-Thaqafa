import express from 'express';
import { checkAuth, forgotPassword, login, logout, resetPassword, signup,verifyEmail, updateProfile } from './auth.controller.js';
import { verifyToken } from "../../middleware/verifyToken.js";
import {upload} from "../../middleware/upload.js"

const router = express.Router();

router.post('/login', login);  
router.post('/logout', logout);
router.post('/signup',upload.single('filename'), signup);


router.post('/verifyEmail', verifyEmail);
router.get("/checkAuth", verifyToken, checkAuth);

router.post('/forgotPassword', forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.put('/profile', verifyToken, updateProfile);

export default router;