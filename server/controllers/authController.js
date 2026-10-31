import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Fallback in-memory store if MongoDB is not connected
const memoryUsers = new Map();

// Seed a default demo account for immediate testing
(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('ResQNow2026!', salt);
  memoryUsers.set('alex.morgan@resqnow.demo', {
    _id: '507f1f77bcf86cd799439011',
    name: 'Alex Morgan',
    email: 'alex.morgan@resqnow.demo',
    phone: '+1 (555) 019-2834',
    password: hashedPassword,
    bloodType: 'O+',
    allergies: 'Penicillin, Bee Stings',
    emergencyNotes: 'Carries EpiPen in backpack side pocket. Asthmatic.',
    createdAt: new Date(),
  });
})();

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'resqnow_jwt_secret_dev';
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: '30d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, bloodType, allergies, emergencyNotes } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try MongoDB Atlas if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({
            success: false,
            message: 'An account with this email already exists.',
          });
        }

        const user = await User.create({
          name,
          email: cleanEmail,
          phone: phone || '',
          password,
          bloodType: bloodType || 'Unknown',
          allergies: allergies || '',
          emergencyNotes: emergencyNotes || '',
        });

        const token = generateToken(user);

        return res.status(201).json({
          success: true,
          token,
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
      } catch (dbErr) {
        // Fall back to memoryUsers below
      }
    }

    // 2. Memory store fallback
    if (memoryUsers.has(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newId = `user-${Date.now()}`;

    const fallbackUser = {
      _id: newId,
      name,
      email: cleanEmail,
      phone: phone || '',
      password: hashedPassword,
      bloodType: bloodType || 'Unknown',
      allergies: allergies || '',
      emergencyNotes: emergencyNotes || '',
      createdAt: new Date(),
    };

    memoryUsers.set(cleanEmail, fallbackUser);
    const token = generateToken(fallbackUser);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: fallbackUser._id,
        name: fallbackUser.name,
        email: fallbackUser.email,
        phone: fallbackUser.phone,
        bloodType: fallbackUser.bloodType,
        allergies: fallbackUser.allergies,
        emergencyNotes: fallbackUser.emergencyNotes,
        createdAt: fallbackUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try MongoDB Atlas if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user && (await user.matchPassword(password))) {
          const token = generateToken(user);
          return res.json({
            success: true,
            token,
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

    // 2. Check in-memory store
    const memUser = memoryUsers.get(cleanEmail);
    if (memUser) {
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (isMatch) {
        const token = generateToken(memUser);
        return res.json({
          success: true,
          token,
          user: {
            id: memUser._id.toString(),
            name: memUser.name,
            email: memUser.email,
            phone: memUser.phone,
            bloodType: memUser.bloodType,
            allergies: memUser.allergies,
            emergencyNotes: memUser.emergencyNotes,
            createdAt: memUser.createdAt,
          },
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
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
        // Fallback below
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

export default { register, login, getMe };
