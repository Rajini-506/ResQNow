import mongoose from 'mongoose';
import Incident from '../models/Incident.js';
import geminiService from '../services/geminiService.js';

// Fallback in-memory incidents
let memoryIncidents = [
  {
    id: 'rep-demo-1',
    _id: 'rep-demo-1',
    userId: '507f1f77bcf86cd799439011',
    type: 'Accident',
    description: 'Two-car intersection collision with minor bumper damage and radiator fluid leak on road.',
    latitude: 37.7833,
    longitude: -122.4167,
    address: 'Mission St & 8th St, San Francisco, CA',
    imageUrl: '',
    aiClassification: {
      category: 'Accident',
      urgency: 'High',
      summary: 'Vehicle collision with fluid leak hazard',
      recommendedAction: 'Keep bystanders away from engine fluids, maintain perimeter until highway patrol arrives.',
      immediateChecklist: [
        'Confirm personal safety perimeter',
        'Dial highway patrol if lane is blocked',
        'Share coordinates with authorities',
      ],
    },
    status: 'Submitted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

export const createIncident = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      type,
      description,
      latitude,
      longitude,
      address,
      imageUrl,
      aiClassification,
    } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description of the incident.',
      });
    }

    let finalAiClassification = aiClassification;
    if (!finalAiClassification || !finalAiClassification.summary) {
      try {
        finalAiClassification = await geminiService.classifyIncident({ description });
      } catch (err) {
        console.warn('Backend auto-classification failed:', err.message);
        finalAiClassification = {
          category: type || 'General',
          urgency: 'Medium',
          summary: description.slice(0, 100),
          recommendedAction: 'Report to local authorities if urgent.',
          immediateChecklist: ['Ensure personal safety'],
        };
      }
    }

    const incidentData = {
      userId,
      type: type || finalAiClassification.category || 'Accident',
      description,
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      address: address || '',
      imageUrl: imageUrl || '',
      aiClassification: finalAiClassification,
      status: 'Submitted',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const incident = await Incident.create(incidentData);
        return res.status(201).json({
          success: true,
          incident: {
            id: incident._id.toString(),
            _id: incident._id.toString(),
            userId: incident.userId.toString(),
            type: incident.type,
            description: incident.description,
            latitude: incident.latitude,
            longitude: incident.longitude,
            address: incident.address,
            imageUrl: incident.imageUrl,
            aiClassification: incident.aiClassification,
            status: incident.status,
            createdAt: incident.createdAt,
          },
        });
      } catch (dbErr) {
        // Fall back below
      }
    }

    const newId = `rep-${Date.now()}`;
    const fallback = {
      id: newId,
      _id: newId,
      ...incidentData,
    };
    memoryIncidents.unshift(fallback);
    return res.status(201).json({ success: true, incident: fallback });
  } catch (error) {
    next(error);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const incidents = await Incident.find({ userId }).sort({ createdAt: -1 });
        const formatted = incidents.map((i) => ({
          id: i._id.toString(),
          _id: i._id.toString(),
          userId: i.userId.toString(),
          type: i.type,
          description: i.description,
          latitude: i.latitude,
          longitude: i.longitude,
          address: i.address,
          imageUrl: i.imageUrl,
          aiClassification: i.aiClassification,
          status: i.status,
          createdAt: i.createdAt,
        }));
        return res.json({ success: true, count: formatted.length, incidents: formatted });
      } catch (dbErr) {
        // Fall back below
      }
    }

    const userList = memoryIncidents.filter((i) => i.userId === userId || i.userId === '507f1f77bcf86cd799439011');
    return res.json({ success: true, count: userList.length, incidents: userList });
  } catch (error) {
    next(error);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const incident = await Incident.findById(id);
        if (incident) {
          return res.json({
            success: true,
            incident: {
              id: incident._id.toString(),
              _id: incident._id.toString(),
              userId: incident.userId.toString(),
              type: incident.type,
              description: incident.description,
              latitude: incident.latitude,
              longitude: incident.longitude,
              address: incident.address,
              imageUrl: incident.imageUrl,
              aiClassification: incident.aiClassification,
              status: incident.status,
              createdAt: incident.createdAt,
            },
          });
        }
      } catch (dbErr) {
        // Fall back below
      }
    }

    const found = memoryIncidents.find((i) => i.id === id || i._id === id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Incident report not found.' });
    }

    return res.json({ success: true, incident: found });
  } catch (error) {
    next(error);
  }
};

export default {
  createIncident,
  getIncidents,
  getIncidentById,
};
