import express from 'express';
import {
    getUsersIsApproved,
    getUsersIsNotApproved,
    updateUser,
    deleteUser,
    getUserById,
    approveUser, getAllUsers
} from './users.controller.js';
import {  
    deletePartner,
    getPartnersIsApproved,
    getPartnersIsNotApproved,
    approvePartner
} from './partner.controller.js';
import {verifyToken} from '../../middleware/verifyToken.js';
import {verifyPartner, verifyAdmin} from '../../middleware/verifyRole.js';

const router = express.Router();

router.get('/partnersIsNotApproved', verifyToken, getPartnersIsNotApproved, );
router.get('/partnersIsApproved', verifyToken, getPartnersIsApproved);
router.delete('/partner/:id', verifyToken,  deletePartner);
router.patch('/partner/:id', verifyToken, approvePartner)

router.patch('/user/:id', verifyToken, approveUser)
router.get('/usersIsNotApproved',verifyToken, getUsersIsNotApproved);
router.get('/usersIsApproved',verifyToken, getUsersIsApproved);
router.get('/Users', getAllUsers);


router.put('/:id',verifyToken, updateUser);
router.delete('/user/:id', verifyToken,  deleteUser);
router.get('/:id',verifyToken, getUserById);
router.get('/getAllUsers', getUsersIsApproved);





export default router;