import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Send,
  Eye,
} from 'lucide-react';
import type {
  EmergencyCategory,
  IncidentReport,
  AIClassificationResult,
  AIImageAnalysisResult,
} from '../types';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { incidentAPI } from '../services/api';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const INCIDENT_TYPES: EmergencyCategory[] = [
  'Accident',
  'Medical',
  'Fire',
  'Personal Safety',
  'Natural Disaster',
  'Other',
];

interface IncidentFormProps {
  onSubmitted?: (report: IncidentReport) => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({ onSubmitted }) => {
  const { coords } = useEmergency();
  const { currentUser } = useAuth();

  const [type, setType] = useState<EmergencyCategory>('Accident');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState(
    coords.address || `${coords.latitude}, ${coords.longitude}`
  );
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Image upload and analysis state
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<AIImageAnalysisResult | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // AI Classification state
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiClassification, setAiClassification] = useState<AIClassificationResult | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File to base64 converter
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageError('Image file size must be under 8MB.');
      return;
    }

    setImageError(null);
    setImageMime(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
      setImageAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  // Run AI Image Analysis
  const handleAnalyzePhoto = async () => {
    if (!imageBase64) return;
    setIsAnalyzingImage(true);
    setImageError(null);

    try {
      const res = await geminiService.analyzeIncidentPhoto(imageBase64, imageMime, description);
      setImageAnalysis(res);
    } catch (err: any) {
      setImageError(err?.message || 'Failed to analyze incident photograph.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Run AI Situation Classification
  const handleClassifyDescription = async () => {
    if (!description.trim()) {
      setErrorMessage('Please enter an incident description before requesting AI classification.');
      return;
    }

    setIsClassifying(true);
    setErrorMessage(null);

    try {
      const res = await geminiService.classifySituation(description);
      setAiClassification(res);
      if (res.category && INCIDENT_TYPES.includes(res.category)) {
        setType(res.category);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to classify situation.');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please provide a detailed incident description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await incidentAPI.create({
        type,
        description,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: locationAddress,
        imageUrl: imageBase64 || '',
        aiClassification: aiClassification
          ? {
              category: aiClassification.category,
              urgency: aiClassification.urgency,
              summary: aiClassification.summary,
              recommendedAction: aiClassification.recommendedAction,
              immediateChecklist: aiClassification.immediateChecklist,
            }
          : undefined,
      });

      const savedReport: IncidentReport = {
        id: res.incident?.id || res.incident?._id || `rep-${Date.now()}`,
        userId: currentUser ? currentUser.uid : 'guest',
        type,
        description,
        location: {
          ...coords,
          address: locationAddress,
        },
        dateTime,
        imageBase64: imageBase64 || undefined,
        additionalNotes,
        aiClassification: aiClassification
          ? {
              category: aiClassification.category,
              urgency: aiClassification.urgency,
              summary: aiClassification.summary,
              recommendedAction: aiClassification.recommendedAction,
            }
          : undefined,
        status: 'Submitted',
        createdAt: new Date().toISOString(),
      };

      setSubmittedSuccess(true);
      if (onSubmitted) {
        onSubmitted(savedReport);
      }

      // Reset form
      setDescription('');
      setImageBase64(null);
      setImageAnalysis(null);
      setAiClassification(null);
      setAdditionalNotes('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit incident report. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="incident-report-form-container"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <FileText className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Incident Report Form</h3>
          <p className="text-xs text-slate-500">
            Document accidents, hazards, and situations with optional AI assessment
          </p>
        </div>
      </div>

      {submittedSuccess && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-sm block">Incident report saved successfully.</span>
              Your record has been logged in the system and is visible in your Emergency History.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedSuccess(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Incident Type Selector */}
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
            Incident Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INCIDENT_TYPES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setType(cat)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  type === cat
                    ? 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description + AI Classification Button */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="incident-desc-input"
              className="text-xs font-bold text-slate-800 uppercase tracking-wider"
            >
              Description &amp; Observations *
            </label>

            <button
              id="ai-classify-btn"
              type="button"
              onClick={handleClassifyDescription}
              disabled={isClassifying || !description.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 disabled:text-slate-400 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isClassifying ? 'Classifying...' : 'AI Classify with Gemini'}</span>
            </button>
          </div>

          <textarea
            id="incident-desc-input"
            rows={3}
            placeholder="Describe what occurred, who is involved, visible risks, or damages..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
            required
          />
        </div>

        {/* AI Classification Result Box */}
        {aiClassification && (
          <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Gemini Incident Triage Classification
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-extrabold text-[11px]">
                {aiClassification.urgency} Urgency
              </span>
            </div>
            <p className="text-slate-800 font-medium">{aiClassification.summary}</p>
            <div className="p-2.5 rounded-lg bg-white border border-rose-100 text-slate-700">
              <strong className="text-rose-700 block mb-1">Recommended Action:</strong>
              {aiClassification.recommendedAction}
            </div>
          </div>
        )}

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="incident-location-input"
              className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5"
            >
              Incident Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="incident-location-input"
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Street address, cross street, or landmarks"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="incident-datetime-input"
              className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5"
            >
              Date &amp; Time
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="incident-datetime-input"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Optional Image Upload & Multimodal Analysis */}
        <div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
            Scene Photograph (Optional)
          </span>

          {!imageBase64 ? (
            <label
              htmlFor="incident-photo-upload"
              className="border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-rose-50/20 transition-all text-center"
            >
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700">
                Click or drag to upload an incident photo
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, or WEBP up to 8MB. Analyzed with Gemini Vision.
              </span>
              <input
                id="incident-photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={imageBase64}
                    alt="Incident preview"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Incident Photo Attached
                    </span>
                    <span className="text-[11px] text-slate-500">Ready for visual evaluation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAnalyzePhoto}
                    disabled={isAnalyzingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAnalyzingImage ? 'Analyzing...' : 'Analyze with Gemini'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageBase64(null);
                      setImageAnalysis(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Multimodal Analysis Outcome */}
              {imageAnalysis && (
                <div className="mt-3 p-3.5 rounded-lg bg-white border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-rose-600" />
                      Visual Observations:
                    </strong>
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {imageAnalysis.possibleCategory}
                    </span>
                  </div>
                  <p className="text-slate-700 italic">{imageAnalysis.observations}</p>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">
                      Scene Safety Recommendations:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {imageAnalysis.safetyRecommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    {imageAnalysis.cautionDisclaimer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label
            htmlFor="incident-notes-input"
            className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5"
          >
            Additional Notes &amp; Follow-up
          </label>
          <input
            id="incident-notes-input"
            type="text"
            placeholder="e.g. Bystanders present, license plate noted, tow truck called..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            id="submit-incident-report-btn"
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving Report...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Incident Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;
