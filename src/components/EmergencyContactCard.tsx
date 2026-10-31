import React, { useState } from 'react';
import { Phone, MessageSquare, Trash2, Edit3, User, Heart, Shield, Check, X } from 'lucide-react';
import type { EmergencyContact } from '../types';
import { useEmergency } from '../context/EmergencyContext';
import ConfirmationModal from './ConfirmationModal';

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onEdit?: (contact: EmergencyContact) => void;
  onDelete?: (contactId: string) => void;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  const { coords } = useEmergency();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const cleanPhone = contact.phoneNumber.replace(/[^\d+]/g, '');

  const smsText = encodeURIComponent(
    `ResQNow Alert: Emergency message from ${contact.name}'s contact. Current Location: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
  );

  return (
    <>
      <div
        id={`contact-card-${contact.id}`}
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{contact.name}</h4>
                <span className="inline-block text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60 mt-0.5">
                  {contact.relationship}
                </span>
              </div>
            </div>

            {contact.isPrimary && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Primary
              </span>
            )}
          </div>

          <div className="mt-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono font-medium text-slate-700">
            {contact.phoneNumber}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Action buttons: Call and SMS */}
          <div className="flex items-center gap-2 flex-1">
            <a
              id={`call-contact-${contact.id}`}
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex-1 transition-colors"
              title={`Call ${contact.name}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <a
              id={`sms-contact-${contact.id}`}
              href={`sms:${cleanPhone}?body=${smsText}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              title={`Send SOS SMS to ${contact.name}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SMS</span>
            </a>
          </div>

          {/* Edit / Delete actions */}
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(contact)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit Contact"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Remove Emergency Contact?"
        message={`Are you sure you want to delete ${contact.name} from your trusted emergency contacts list?`}
        confirmLabel="Remove Contact"
        onConfirm={() => {
          if (onDelete) onDelete(contact.id);
          setDeleteModalOpen(false);
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default EmergencyContactCard;
