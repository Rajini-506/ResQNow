import express from 'express';
import {
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergency,
} from '../controllers/emergencyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createEmergency);
router.get('/', protect, getEmergencies);
router.get('/:id', protect, getEmergencyById);
router.patch('/:id', protect, updateEmergency);

export default router;
