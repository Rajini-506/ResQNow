import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Phone,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'];

export const Profile: React.FC = () => {
  const { userProfile, updateProfileData } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [bloodType, setBloodType] = useState(userProfile?.bloodType || 'O+');
  const [allergies, setAllergies] = useState(userProfile?.allergies || '');
  const [emergencyNotes, setEmergencyNotes] = useState(userProfile?.emergencyNotes || '');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setBloodType(userProfile.bloodType || 'O+');
      setAllergies(userProfile.allergies || '');
      setEmergencyNotes(userProfile.emergencyNotes || '');
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await updateProfileData({
        fullName,
        phoneNumber,
        bloodType,
        allergies,
        emergencyNotes,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update emergency medical profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="user-profile-page" className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Emergency Profile &amp; Medical ID
              </h1>
              <p className="text-xs text-slate-500">
                Critical health details packaged for first responders and paramedic lookup
              </p>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">Medical emergency profile updated successfully.</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Edit Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Personal Contact Details
              </h3>

              <div>
                <label
                  htmlFor="profile-name-input"
                  className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                >
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="profile-name-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-email-input"
                  className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                >
                  Email (Account Identifier)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="profile-email-input"
                    type="email"
                    value={userProfile?.email || ''}
                    disabled
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-phone-input"
                  className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="profile-phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Paramedic Medical ID</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="profile-blood-type"
                      className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                    >
                      Blood Group
                    </label>
                    <select
                      id="profile-blood-type"
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    >
                      {BLOOD_TYPES.map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-allergies-input"
                      className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                    >
                      Severe Allergies (Foods, Drugs, Stings)
                    </label>
                    <input
                      id="profile-allergies-input"
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, Latex, Peanuts"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-notes-input"
                      className="font-bold text-slate-800 uppercase tracking-wider block mb-1"
                    >
                      Critical Medical Conditions &amp; Medication Notes
                    </label>
                    <textarea
                      id="profile-notes-input"
                      rows={3}
                      value={emergencyNotes}
                      onChange={(e) => setEmergencyNotes(e.target.value)}
                      placeholder="e.g. Diabetic Type 1 (carries glucose), Asthmatic, Pacemaker installed..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  id="save-profile-btn"
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Medical ID Card Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/40">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                    +
                  </div>
                  <span className="font-extrabold text-sm tracking-wider uppercase">
                    EMERGENCY MEDICAL ID
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded">
                  ResQNow
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block">
                    Individual
                  </span>
                  <span className="text-base font-black text-white">{fullName || 'Jane Doe'}</span>
                  <span className="text-[11px] text-rose-100 block font-mono">
                    {phoneNumber || 'No phone set'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-500/40">
                  <div>
                    <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block">
                      Blood Type
                    </span>
                    <span className="text-sm font-extrabold text-white">{bloodType}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block">
                      Allergies
                    </span>
                    <span className="text-xs font-semibold text-rose-50 truncate block">
                      {allergies || 'None documented'}
                    </span>
                  </div>
                </div>

                {emergencyNotes && (
                  <div className="pt-2 border-t border-rose-500/40">
                    <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block mb-0.5">
                      Medical Notes
                    </span>
                    <p className="text-[11px] text-rose-100 italic bg-black/15 p-2 rounded-lg leading-relaxed">
                      "{emergencyNotes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 space-y-1">
              <span className="font-bold text-slate-900 block">First-Responder Visibility</span>
              <p>
                In an active crisis, paramedic teams can reference these key physiological points to
                ensure safe fluid, anesthesia, and medication choices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
