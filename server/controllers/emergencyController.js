import mongoose from 'mongoose';
import Emergency from '../models/Emergency.js';

// In-memory fallback if MongoDB Atlas is connecting or offline
const memoryEmergencies = [];

export const createEmergency = async (req, res, next) => {
  try {
    const { type, description, latitude, longitude, accuracy, address } = req.body;
    const userId = req.user.id;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates (latitude, longitude) are required for emergency dispatch.',
      });
    }

    const emergencyData = {
      userId,
      type: type || 'Medical',
      description: description || 'Emergency SOS initiated via ResQNow.',
      latitude: Number(latitude),
      longitude: Number(longitude),
      accuracy: Number(accuracy) || 0,
      address: address || '',
      status: 'Emergency request created',
      createdAt: new Date(),
    };

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const emergency = await Emergency.create(emergencyData);
        return res.status(201).json({
          success: true,
          message: 'Emergency request created. Please dial 911 / 112 if in life-threatening peril.',
          emergency: {
            id: emergency._id.toString(),
            _id: emergency._id.toString(),
            userId: emergency.userId.toString(),
            type: emergency.type,
            description: emergency.description,
            latitude: emergency.latitude,
            longitude: emergency.longitude,
            accuracy: emergency.accuracy,
            address: emergency.address,
            status: emergency.status,
            createdAt: emergency.createdAt,
          },
        });
      } catch (dbErr) {
        // Fall back below
      }
    }

    // 2. Fallback memory store
    const fallbackId = `sos-${Date.now()}`;
    const fallbackEmergency = {
      id: fallbackId,
      _id: fallbackId,
      ...emergencyData,
    };
    memoryEmergencies.unshift(fallbackEmergency);

    return res.status(201).json({
      success: true,
      message: 'Emergency request created. Please dial 911 / 112 if in life-threatening peril.',
      emergency: fallbackEmergency,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmergencies = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const emergencies = await Emergency.find({ userId }).sort({ createdAt: -1 });
        const formatted = emergencies.map((e) => ({
          id: e._id.toString(),
          _id: e._id.toString(),
          userId: e.userId.toString(),
          type: e.type,
          description: e.description,
          latitude: e.latitude,
          longitude: e.longitude,
          accuracy: e.accuracy,
          address: e.address,
          status: e.status,
          createdAt: e.createdAt,
        }));
        return res.json({ success: true, count: formatted.length, emergencies: formatted });
      } catch (dbErr) {
        // Fall back below
      }
    }

    const userList = memoryEmergencies.filter((e) => e.userId === userId);
    return res.json({ success: true, count: userList.length, emergencies: userList });
  } catch (error) {
    next(error);
  }
};

export const getEmergencyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const emergency = await Emergency.findById(id);
        if (emergency) {
          return res.json({
            success: true,
            emergency: {
              id: emergency._id.toString(),
              _id: emergency._id.toString(),
              userId: emergency.userId.toString(),
              type: emergency.type,
              description: emergency.description,
              latitude: emergency.latitude,
              longitude: emergency.longitude,
              accuracy: emergency.accuracy,
              address: emergency.address,
              status: emergency.status,
              createdAt: emergency.createdAt,
            },
          });
        }
      } catch (dbErr) {
        // Fall back below
      }
    }

    const found = memoryEmergencies.find((e) => e.id === id || e._id === id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Emergency record not found.' });
    }

    return res.json({ success: true, emergency: found });
  } catch (error) {
    next(error);
  }
};

export const updateEmergency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const emergency = await Emergency.findById(id);
        if (emergency) {
          if (status) emergency.status = status;
          if (description) emergency.description = description;
          const updated = await emergency.save();
          return res.json({
            success: true,
            emergency: {
              id: updated._id.toString(),
              _id: updated._id.toString(),
              userId: updated.userId.toString(),
              type: updated.type,
              description: updated.description,
              latitude: updated.latitude,
              longitude: updated.longitude,
              accuracy: updated.accuracy,
              address: updated.address,
              status: updated.status,
              createdAt: updated.createdAt,
            },
          });
        }
      } catch (dbErr) {
        // Fall back below
      }
    }

    const index = memoryEmergencies.findIndex((e) => e.id === id || e._id === id);
    if (index !== -1) {
      if (status) memoryEmergencies[index].status = status;
      if (description) memoryEmergencies[index].description = description;
      return res.json({ success: true, emergency: memoryEmergencies[index] });
    }

    return res.status(404).json({ success: false, message: 'Emergency record not found.' });
  } catch (error) {
    next(error);
  }
};

export default {
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergency,
};
