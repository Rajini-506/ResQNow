import React, { useState } from 'react';
import {
  ShieldAlert,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Share2,
} from 'lucide-react';
import type { EmergencyRequest } from '../types';
import { useEmergency } from '../context/EmergencyContext';
import { mapsService } from '../services/mapsService';
import ConfirmationModal from './ConfirmationModal';

interface EmergencyCardProps {
  request: EmergencyRequest;
  isDetailed?: boolean;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  request,
  isDetailed = false,
}) => {
  const { resolveSOS, cancelSOS, contacts } = useEmergency();
  const [confirmModal, setConfirmModal] = useState<'resolve' | 'cancel' | null>(null);

  const googleMapsUrl = mapsService.getGoogleMapsUrl(request.location);

  // Pre-formatted emergency SMS body for trusted contacts
  const emergencySmsBody = encodeURIComponent(
    `EMERGENCY ALERT via ResQNow:\nI triggered an SOS request (${request.type}).\nLocation: https://maps.google.com/?q=${request.location.latitude},${request.location.longitude}\nNotes: ${request.additionalDetails || 'Immediate assistance requested.'}`
  );

  return (
    <>
      <div
        id={`emergency-card-${request.id}`}
        className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-md shadow-rose-100/50 relative overflow-hidden"
      >
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Request Status:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-extrabold text-xs">
              {request.status === 'created'
                ? 'Emergency request created'
                : request.status.toUpperCase()}
            </span>
          </div>

          <span className="text-xs font-mono text-slate-400">
            ID: #{request.id.slice(-6)}
          </span>
        </div>

        {/* Incident Type & User Info */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Emergency Category
            </span>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              {request.type}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                {request.urgency} Urgency
              </span>
            </h3>
            {request.additionalDetails && (
              <p className="mt-1 text-xs text-slate-600 italic">
                "{request.additionalDetails}"
              </p>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Reporter Details
            </span>
            <div className="mt-0.5 text-xs text-slate-800 font-semibold space-y-0.5">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{request.userName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(request.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Recorded Emergency Coordinates</span>
              </div>
              <p className="text-xs text-slate-600 font-mono">
                Lat: {request.location.latitude.toFixed(5)}, Lng:{' '}
                {request.location.longitude.toFixed(5)}
                {request.location.address && ` • ${request.location.address}`}
              </p>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:text-rose-600 transition-colors shrink-0"
            >
              <span>View Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice:</span> This request has been created and logged
            locally and in your records. To receive physical emergency response, utilize the direct
            call buttons below to contact local dispatch services immediately.
          </div>
        </div>

        {/* Emergency Call & Contact Action Buttons */}
        <div className="mt-5 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Immediate Response Actions:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              id="call-911-action-btn"
              href="tel:911"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-200 transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call 911 / 112 Now</span>
            </a>

            {contacts.length > 0 ? (
              <a
                id="notify-primary-contact-btn"
                href={`sms:${contacts[0].phoneNumber}?body=${emergencySmsBody}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Text Emergency Contact ({contacts[0].name.split(' ')[0]})</span>
              </a>
            ) : (
              <a
                id="share-sos-location-btn"
                href={`sms:?body=${emergencySmsBody}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Send SOS SMS with Coords</span>
              </a>
            )}
          </div>
        </div>

        {/* Resolve or Cancel Options */}
        {request.status === 'created' || request.status === 'active' ? (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
            <button
              id="cancel-sos-btn"
              type="button"
              onClick={() => setConfirmModal('cancel')}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel False Alarm
            </button>

            <button
              id="mark-sos-resolved-btn"
              type="button"
              onClick={() => setConfirmModal('resolve')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark as Resolved / Safe
            </button>
          </div>
        ) : null}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal !== null}
        title={confirmModal === 'resolve' ? 'Mark SOS as Resolved?' : 'Cancel Emergency Request?'}
        message={
          confirmModal === 'resolve'
            ? 'Confirm that you are safe and the emergency situation has concluded. This will archive the active alert status.'
            : 'If this was triggered accidentally, confirm cancellation to clear the active alert flag.'
        }
        confirmLabel={confirmModal === 'resolve' ? 'Yes, Mark Resolved' : 'Confirm Cancel'}
        isUrgent={false}
        onConfirm={async () => {
          if (confirmModal === 'resolve') {
            await resolveSOS(request.id);
          } else if (confirmModal === 'cancel') {
            await cancelSOS(request.id);
          }
          setConfirmModal(null);
        }}
        onCancel={() => setConfirmModal(null)}
      />
    </>
  );
};

export default EmergencyCard;
