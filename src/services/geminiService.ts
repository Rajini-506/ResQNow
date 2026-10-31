import { aiAPI } from './api';
import type {
  AIClassificationResult,
  AIImageAnalysisResult,
} from '../types';

export const geminiService = {
  /**
   * ResQ AI Chat Guidance via Axios backend client
   */
  async getEmergencyGuidance(
    messages: { role: string; content: string }[],
    situationContext?: string
  ): Promise<{ reply: string; isDemo: boolean }> {
    try {
      const data = await aiAPI.chat({ messages, situationContext });
      return {
        reply: data.reply || 'Please contact local emergency responders (911/112) immediately.',
        isDemo: Boolean(data.isDemo),
      };
    } catch (err: any) {
      console.warn('Gemini chat Axios error, using safe fallback guidance:', err);
      return {
        reply:
          '⚠️ Emergency Guidance System Notice:\n\n' +
          '1. If anyone is in immediate physical danger, dial your local emergency services (911 / 112) right now.\n' +
          '2. Ensure you and bystanders are in a protected location away from hazards.\n' +
          '3. If medical distress is occurring, check if the person responds and breathes. Do not move injured persons unless immediate environmental hazard is present.',
        isDemo: true,
      };
    }
  },

  /**
   * AI Emergency Classification via Axios backend client
   */
  async classifySituation(description: string): Promise<AIClassificationResult> {
    try {
      const data = await aiAPI.classify(description);
      return {
        category: data.category || 'Other',
        urgency: data.urgency || 'High',
        summary: data.summary || 'Emergency incident reported.',
        recommendedAction:
          data.recommendedAction ||
          'Contact local emergency dispatch (911/112) and stay in a secure area.',
        immediateChecklist: Array.isArray(data.immediateChecklist)
          ? data.immediateChecklist
          : [
              'Verify immediate physical safety perimeter',
              'Contact official emergency dispatch',
              'Share live coordinates with designated emergency contacts',
            ],
        isDemo: Boolean(data.isDemo),
      };
    } catch (err: any) {
      console.warn('Classification Axios error, using fallback triage:', err);
      return {
        category: 'Other',
        urgency: 'High',
        summary: 'Emergency situation recorded for rapid dispatch assessment.',
        recommendedAction:
          'Dial local emergency dispatch (911/112) directly. Do not wait if lives are in jeopardy.',
        immediateChecklist: [
          'Ensure scene is safe for approach',
          'Call emergency authorities',
          'Notify trusted contacts from contacts list',
        ],
        isDemo: true,
      };
    }
  },

  /**
   * Multimodal Incident Image Analysis via Axios backend client
   */
  async analyzeIncidentPhoto(
    imageBase64: string,
    mimeType: string = 'image/jpeg',
    notes?: string
  ): Promise<AIImageAnalysisResult> {
    try {
      const data = await aiAPI.analyzeImage(imageBase64, notes);
      return {
        observations:
          data.observations ||
          'Visual analysis completed. Scene visual markers have been recorded.',
        possibleCategory: data.possibleCategory || 'Physical Incident',
        safetyRecommendations: Array.isArray(data.safetyRecommendations)
          ? data.safetyRecommendations
          : [
              'Keep a clear perimeter from any structural or vehicle damage.',
              'Check for hazardous liquids, smoke, or exposed wires.',
              'Call 911 / 112 if anyone requires medical treatment.',
            ],
        cautionDisclaimer:
          data.cautionDisclaimer ||
          'Automated AI visual assessment is observational only and must not replace professional on-scene assessment.',
        isDemo: Boolean(data.isDemo),
      };
    } catch (err: any) {
      console.warn('Image analysis Axios error, providing safe fallback evaluation:', err);
      return {
        observations:
          'This uploaded image has been cataloged for incident records. In high-stress scenarios, prioritize personal evacuation over photography.',
        possibleCategory: 'Accident / Environmental Hazard',
        safetyRecommendations: [
          'Stay back at a safe distance from collision or hazard zones.',
          'Do not touch exposed electrical cables or leaking chemicals.',
          'Direct first responders to the exact entrance upon arrival.',
        ],
        cautionDisclaimer:
          'Observational guidance only. ResQNow does not provide certified medical diagnoses.',
        isDemo: true,
      };
    }
  },
};

export default geminiService;
