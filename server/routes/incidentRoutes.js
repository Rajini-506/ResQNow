import express from 'express';
import {
  createIncident,
  getIncidents,
  getIncidentById,
} from '../controllers/incidentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createIncident);
router.get('/', protect, getIncidents);
router.get('/:id', protect, getIncidentById);

export default router;
