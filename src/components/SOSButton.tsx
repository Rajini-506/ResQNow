import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Flame,
  Activity,
  Car,
  UserX,
  AlertTriangle,
  Radio,
  CheckCircle,
  Phone,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import ConfirmationModal from './ConfirmationModal';
import type { EmergencyCategory } from '../types';

interface SOSButtonProps {
  onTriggered?: () => void;
  className?: string;
  size?: 'normal' | 'large';
}

const EMERGENCY_TYPES: { id: EmergencyCategory; label: string; icon: any; color: string }[] = [
  { id: 'Medical', label: 'Medical Emergency', icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Accident', label: 'Vehicle / Crash', icon: Car, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Fire', label: 'Fire Incident', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'Personal Safety', label: 'Personal Safety / Threat', icon: UserX, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Other', label: 'Other Urgent Distress', icon: AlertTriangle, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

export const SOSButton: React.FC<SOSButtonProps> = ({
  onTriggered,
  className = '',
  size = 'large',
}) => {
  const { triggerSOS, isLocating, activeSOS } = useEmergency();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EmergencyCategory>('Medical');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleStartSOS = () => {
    setModalOpen(true);
  };

  const handleConfirmSOS = async () => {
    setIsSubmitting(true);
    try {
      await triggerSOS(selectedType, 'Critical', details);
      setModalOpen(false);
      if (onTriggered) {
        onTriggered();
      } else {
        navigate('/emergency');
      }
    } catch (err) {
      console.error('Failed to trigger SOS:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        id="sos-button-wrapper"
        className={`flex flex-col items-center justify-center text-center ${className}`}
      >
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 animate-pulse">
          <Radio className="w-3.5 h-3.5 text-rose-600" />
          Immediate Emergency Dispatch
        </span>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
          Are you in an emergency?
        </h3>

        {/* Pulsating SOS Button Container */}
        <div className="relative flex items-center justify-center p-4">
          {/* Outer Pulsing Waves */}
          <span className="absolute w-56 h-56 rounded-full bg-rose-500/20 animate-ping duration-1000" />
          <span className="absolute w-48 h-48 rounded-full bg-rose-500/30 animate-pulse duration-700" />

          <button
            id="activate-sos-button"
            type="button"
            onClick={handleStartSOS}
            disabled={isSubmitting}
            className={`relative z-10 ${
              size === 'large' ? 'w-44 h-44 sm:w-48 sm:h-48' : 'w-36 h-36'
            } rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-rose-700 text-white font-black shadow-2xl shadow-rose-500/50 hover:shadow-rose-600/70 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 border-4 border-white focus:outline-none focus:ring-4 focus:ring-rose-400`}
            aria-label="Activate SOS Emergency Button"
          >
            <ShieldAlert className="w-12 h-12 text-white animate-bounce" />
            <span className="text-xl sm:text-2xl tracking-wider uppercase font-black drop-shadow-sm">
              ACTIVATE SOS
            </span>
            <span className="text-[10px] font-semibold tracking-wide text-rose-100 uppercase opacity-90">
              Tap for Instant Help
            </span>
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500 max-w-sm leading-relaxed">
          Pressing ACTIVATE SOS verifies your current GPS coordinates, creates an emergency
          request, and prepares direct contact channels.
        </p>

        {activeSOS && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            An SOS is currently active.
            <button
              onClick={() => navigate('/emergency')}
              className="text-rose-900 underline font-bold ml-1 hover:text-rose-700"
            >
              View Active Status &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Confirmation & Emergency Categorization Modal */}
      {modalOpen && (
        <div
          id="sos-confirm-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          role="dialog"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-rose-200 text-slate-800">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Confirm Emergency SOS Activation
                </h3>
                <p className="text-xs text-slate-500">
                  Select incident type for tailored safety response
                </p>
              </div>
            </div>

            {/* Select Category */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                What type of emergency is this?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EMERGENCY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional brief notes */}
            <div className="mt-4">
              <label
                htmlFor="sos-brief-notes"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1"
              >
                Brief situation notes (optional)
              </label>
              <input
                id="sos-brief-notes"
                type="text"
                placeholder="e.g. Chest pain, car hit light pole, trapped on 2nd floor..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Location Notice */}
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Accurate Location Transmission:</span> Confirming will
                poll your GPS sensor to package precise latitude, longitude, and an emergency
                timestamp.
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 sm:justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                id="confirm-sos-dispatch-btn"
                type="button"
                onClick={handleConfirmSOS}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>Processing SOS...</>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    Trigger SOS Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
