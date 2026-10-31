import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { getDbStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (gracefully handles connection errors with fallback)
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health and System Diagnostics
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'ok',
    service: 'ResQNow MERN Backend',
    database: dbStatus,
    hasGeminiKey: Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    ),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware for API routes
app.use('/api/*', notFound);
app.use(errorHandler);

// If executed directly (e.g. node server/server.js)
if (process.env.NODE_ENV !== 'test' && !process.env.RUN_VIA_VITE) {
  // Only start listening if this file is the main module
  const isDirect = import.meta.url === `file://${process.argv[1]}`;
  if (isDirect) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 [ResQNow MERN Server] Running on http://0.0.0.0:${PORT}`);
    });
  }
}

export default app;
