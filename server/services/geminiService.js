import { GoogleGenAI, Type } from '@google/genai';

let aiClient = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export const geminiService = {
  /**
   * Generates real-time conversational emergency guidance.
   */
  async generateEmergencyAdvice({ messages, situationContext }) {
    const fallbackAdvice = {
      reply:
        '⚠️ [Immediate Safety Guidance]\n\n' +
        '1. If anyone is in immediate physical danger, dial your local emergency services (911 / 112) right now.\n' +
        '2. Ensure you and bystanders are in a protected location away from live traffic, fire, or hazards.\n' +
        '3. If bleeding: Apply firm, continuous direct pressure with a clean cloth.\n' +
        '4. If unconscious but breathing: Place them in the recovery position on their side.\n' +
        '5. Keep the person calm and warm until professional first responders arrive.',
      isDemo: true,
    };

    const ai = getClient();
    if (!ai) {
      return fallbackAdvice;
    }

    const lastMessage = messages[messages.length - 1]?.content || 'Emergency help requested';
    const historyText = messages
      .slice(0, -1)
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const systemInstruction = `You are "ResQ AI", the dedicated emergency guidance assistant in the ResQNow MERN platform.
PURPOSE: Provide rapid, calm, safety-oriented first-aid and scene-management advice.

MANDATORY RULES:
1. Immediately remind the user to call 911 / 112 if there is active danger, severe bleeding, or unconsciousness.
2. Provide concise, numbered, actionable safety steps (e.g., airway check, direct pressure, escaping smoke).
3. Do NOT claim to be a licensed physician, paramedic, or official dispatcher.
4. Do NOT prescribe medications or suggest high-risk clinical procedures.
5. Keep instructions short and easily readable under intense panic.`;

    const prompt = `Incident Context: ${situationContext || 'Urgent Assistance'}
Previous Dialogue:
${historyText || 'No prior context.'}

User Statement:
${lastMessage}

Provide immediate, structured, calming safety guidance:`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return {
        reply: response.text || fallbackAdvice.reply,
        isDemo: false,
      };
    } catch (err) {
      console.warn('Gemini generateEmergencyAdvice API error, falling back:', err.message);
      return fallbackAdvice;
    }
  },

  /**
   * Evaluates and categorizes an incident description.
   */
  async classifyIncident({ description }) {
    const fallbackClassification = () => {
      const lower = (description || '').toLowerCase();
      let category = 'Other';
      let urgency = 'Medium';
      let recommendedAction = 'Contact emergency authorities and proceed to a safe area.';

      if (lower.match(/blood|bleed|heart|breathe|breath|unconscious|faint|stroke|seiz/)) {
        category = 'Medical';
        urgency = 'Critical';
        recommendedAction = 'Dial 911 / 112 for ambulance dispatch immediately. Check breathing and pulse.';
      } else if (lower.match(/crash|car|vehicle|accident|collision|hit/)) {
        category = 'Accident';
        urgency = 'High';
        recommendedAction = 'Activate hazard flashers, remain clear of traffic lanes, and call highway patrol.';
      } else if (lower.match(/fire|smoke|flame|burn|gas leak/)) {
        category = 'Fire';
        urgency = 'Critical';
        recommendedAction = 'Evacuate immediately. Stay low to the ground and never re-enter the structure.';
      } else if (lower.match(/stalk|threat|follow|intruder|weapon|unsafe/)) {
        category = 'Personal Safety';
        urgency = 'High';
        recommendedAction = 'Move quickly into a crowded, well-lit public building and alert police dispatch.';
      }

      return {
        category,
        urgency,
        summary: `Reported situation: ${category} incident`,
        recommendedAction,
        immediateChecklist: [
          'Verify immediate perimeter safety',
          'Call local emergency dispatch if lives are in jeopardy',
          'Broadcast GPS coordinates to trusted emergency contacts',
        ],
        isDemo: true,
      };
    };

    const ai = getClient();
    if (!ai) {
      return fallbackClassification();
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Classify the following emergency incident:\n"${description}"`,
        config: {
          systemInstruction: `You are an emergency triage classification AI for ResQNow.
Categories: 'Medical', 'Accident', 'Fire', 'Hazard', 'Personal Safety', 'Other'.
Urgency levels: 'Critical', 'High', 'Medium', 'Low'.
Provide a concise factual summary, primary immediate action, and 3-4 checklist steps.
Never provide definitive clinical diagnoses.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              urgency: { type: Type.STRING },
              summary: { type: Type.STRING },
              recommendedAction: { type: Type.STRING },
              immediateChecklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['category', 'urgency', 'summary', 'recommendedAction', 'immediateChecklist'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return { ...parsed, isDemo: false };
    } catch (err) {
      console.warn('Gemini classifyIncident API error, falling back:', err.message);
      return fallbackClassification();
    }
  },

  /**
   * Analyzes an uploaded scene photograph for hazards.
   */
  async analyzeIncidentImage({ imageBase64, mimeType = 'image/jpeg', notes }) {
    const fallbackAnalysis = {
      observations:
        'Image received: In live operation with Gemini API, visual triage highlights potential scene risks (smoke, vehicle impact, fluid spills).',
      possibleCategory: 'Accident / Hazard',
      safetyRecommendations: [
        'Keep a safe distance from damaged structures or vehicles.',
        'Watch for hazards such as electrical wires, broken glass, or leaking fluids.',
        'Contact 911 / 112 if anyone requires medical or rescue help.',
      ],
      cautionDisclaimer:
        'This automated assessment does not replace certified first-responder inspection.',
      isDemo: true,
    };

    const ai = getClient();
    if (!ai) {
      return fallbackAnalysis;
    }

    try {
      const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanedBase64,
                mimeType,
              },
            },
            {
              text: `Analyze this emergency scene photo for hazards. User notes: "${notes || 'None'}"`,
            },
          ],
        },
        config: {
          systemInstruction: `You are an emergency scene visual assistant for ResQNow.
Identify potential visual hazards (downed lines, fire/smoke, vehicle damage, structural collapse).
Use non-definitive phrasing ("This image appears to show...").
Do NOT state legal liability or medical diagnoses.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              observations: { type: Type.STRING },
              possibleCategory: { type: Type.STRING },
              safetyRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              cautionDisclaimer: { type: Type.STRING },
            },
            required: ['observations', 'possibleCategory', 'safetyRecommendations', 'cautionDisclaimer'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return { ...parsed, isDemo: false };
    } catch (err) {
      console.warn('Gemini analyzeIncidentImage error, falling back:', err.message);
      return fallbackAnalysis;
    }
  },
};

export default geminiService;
