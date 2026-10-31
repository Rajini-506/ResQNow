import mongoose from 'mongoose';
import User from '../models/User.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(userId).select('-password');
        if (user) {
          return res.json({
            success: true,
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              phone: user.phone,
              bloodType: user.bloodType,
              allergies: user.allergies,
              emergencyNotes: user.emergencyNotes,
              createdAt: user.createdAt,
            },
          });
        }
      } catch (dbErr) {
        // Fall back below
      }
    }

    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, bloodType, allergies, emergencyNotes } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(userId);
        if (user) {
          if (name) user.name = name;
          if (phone !== undefined) user.phone = phone;
          if (bloodType) user.bloodType = bloodType;
          if (allergies !== undefined) user.allergies = allergies;
          if (emergencyNotes !== undefined) user.emergencyNotes = emergencyNotes;

          const updated = await user.save();
          return res.json({
            success: true,
            user: {
              id: updated._id.toString(),
              name: updated.name,
              email: updated.email,
              phone: updated.phone,
              bloodType: updated.bloodType,
              allergies: updated.allergies,
              emergencyNotes: updated.emergencyNotes,
              createdAt: updated.createdAt,
            },
          });
        }
      } catch (dbErr) {
        // Fall back below
      }
    }

    const updatedUser = {
      ...req.user,
      name: name || req.user.name,
      phone: phone !== undefined ? phone : req.user.phone,
      bloodType: bloodType || req.user.bloodType,
      allergies: allergies !== undefined ? allergies : req.user.allergies,
      emergencyNotes: emergencyNotes !== undefined ? emergencyNotes : req.user.emergencyNotes,
    };

    return res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export default { getUserProfile, updateUserProfile };
