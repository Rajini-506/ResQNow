import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'resqnow_jwt_secret_dev';
      const decoded = jwt.verify(token, secret);

      // Try finding user in MongoDB if connected
      let user = null;
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (err) {
          // Fallback
        }
      }

      if (user) {
        req.user = {
          id: user._id.toString(),
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bloodType: user.bloodType,
          allergies: user.allergies,
          emergencyNotes: user.emergencyNotes,
        };
      } else {
        // Fallback from verified JWT decoded payload
        req.user = {
          id: decoded.id,
          _id: decoded.id,
          name: decoded.name || 'User',
          email: decoded.email || 'user@resqnow.local',
        };
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no Bearer token provided',
    });
  }
};

export default protect;
