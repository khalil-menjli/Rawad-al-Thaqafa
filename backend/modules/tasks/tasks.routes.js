import express from 'express';
import * as tasksCtrl from './tasks.controller.js';
// import * as resCtrl   from '../../controllers/reservation.controller.js';
import {verifyToken}   from '../../middleware/verifyToken.js';
import {upload} from "../../middleware/upload.js"

const router = express.Router();

// Tasks
router.get  ('/',            verifyToken, tasksCtrl.getTasks);
router.get  ('/:id',        verifyToken, tasksCtrl.getTaskById);
router.post ('/',            upload.single('filename'),verifyToken, tasksCtrl.createTask);
router.put  ('/:id',        verifyToken, tasksCtrl.updateTask);
router.delete('/:id',       verifyToken, tasksCtrl.deleteTask);

// Task progress & claim
router.get  ('/tasks/:taskId/status', verifyToken, tasksCtrl.checkTaskStatus);
router.post ('/tasks/:taskId/claim',  verifyToken, tasksCtrl.claimTask);
router.get  ('/tasks/claimed',        verifyToken, tasksCtrl.getClaimedTasks);

// Reservations
// router.post('/reservations', verifyToken, resCtrl.createReservation);

export default router;
