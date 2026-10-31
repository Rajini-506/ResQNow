import React, { useState } from 'react';
import {
  Users,
  Plus,
  Phone,
  Shield,
  Heart,
  MessageSquare,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../services/api';
import EmergencyContactCard from '../components/EmergencyContactCard';
import type { EmergencyContact } from '../types';

export const Contacts: React.FC = () => {
  const { contacts, reloadContacts } = useEmergency();
  const { currentUser } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setRelationship('Family / Partner');
    setPhoneNumber('');
    setIsPrimary(contacts.length === 0);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setRelationship(contact.relationship);
    setPhoneNumber(contact.phoneNumber);
    setIsPrimary(Boolean(contact.isPrimary));
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) {
      setError('Please provide a contact name and phone number.');
      return;
    }

    if (!currentUser) return;

    setIsSaving(true);
    setError(null);

    try {
      if (editingContact) {
        await contactAPI.update(editingContact.id, {
          name,
          relationship,
          phone: phoneNumber,
          isPrimary,
        });
      } else {
        await contactAPI.create({
          name,
          relationship,
          phone: phoneNumber,
          isPrimary,
        });
      }

      await reloadContacts();
      setModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to save contact.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!currentUser) return;
    try {
      await contactAPI.delete(contactId);
      await reloadContacts();
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  return (
    <div id="emergency-contacts-page" className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trusted Emergency Contacts
              </h1>
              <p className="text-xs text-slate-500">
                Designated guardians who will be notified during SOS alerts
              </p>
            </div>
          </div>

          <button
            id="add-new-contact-btn"
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Emergency Contact</span>
          </button>
        </div>

        {/* Informative Security Callout */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 text-xs flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Explicit Action Guarantee:</strong> In strict compliance with safety principles,
            ResQNow does not secretly place automatic phone calls. You retain full control via the
            one-tap "Call" and "Send SMS" buttons.
          </div>
        </div>

        {/* Contact Cards Grid */}
        {contacts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No emergency contacts yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add family members, close friends, or medical caretakers so they can be notified
              instantly when an emergency occurs.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Contact</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <EmergencyContactCard
                key={contact.id}
                contact={contact}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      {modalOpen && (
        <div
          id="contact-form-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="contact-name-input"
                  className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                >
                  Contact Name *
                </label>
                <input
                  id="contact-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contact-relationship-input"
                  className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                >
                  Relationship
                </label>
                <select
                  id="contact-relationship-input"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="Family / Partner">Family / Partner</option>
                  <option value="Parent">Parent</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Close Friend">Close Friend</option>
                  <option value="Physician / Caretaker">Physician / Caretaker</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Neighbor">Neighbor</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-phone-input"
                  className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                >
                  Phone Number *
                </label>
                <input
                  id="contact-phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="contact-primary-checkbox"
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <label
                  htmlFor="contact-primary-checkbox"
                  className="text-xs font-medium text-slate-700 select-none"
                >
                  Designate as Primary Emergency Contact
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
