import express from 'express';
import geminiService from '../services/geminiService.js';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', async (req, res, next) => {
  try {
    const { messages, situationContext } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required for AI chat.',
      });
    }

    const result = await geminiService.generateEmergencyAdvice({
      messages,
      situationContext,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/ai/classify
router.post('/classify', async (req, res, next) => {
  try {
    const { description } = req.body;
    if (!description || typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Description string is required for incident classification.',
      });
    }

    const result = await geminiService.classifyIncident({ description });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/ai/analyze-image
router.post('/analyze-image', async (req, res, next) => {
  try {
    const { imageBase64, mimeType, notes } = req.body;
    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'imageBase64 is required for image analysis.',
      });
    }

    const result = await geminiService.analyzeIncidentImage({
      imageBase64,
      mimeType,
      notes,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
