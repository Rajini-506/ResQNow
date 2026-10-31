import React from 'react';
import {
  ShieldAlert,
  Phone,
  PhoneCall,
  MapPin,
  Clock,
  AlertTriangle,
  HeartHandshake,
  ExternalLink,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import SOSButton from '../components/SOSButton';
import EmergencyCard from '../components/EmergencyCard';
import LocationCard from '../components/LocationCard';
import { mapsService } from '../services/mapsService';

export const Emergency: React.FC = () => {
  const { activeSOS, coords, contacts } = useEmergency();
  const { userProfile } = useAuth();

  const googleMapsUrl = mapsService.getGoogleMapsUrl(coords);

  const emergencySmsText = encodeURIComponent(
    `EMERGENCY ALERT via ResQNow:\nI have triggered an urgent distress alert.\nCoordinates: https://maps.google.com/?q=${coords.latitude},${coords.longitude}\nAddress: ${coords.address || 'GPS Location Attached'}\nPlease check on me or dispatch authorities.`
  );

  return (
    <div id="emergency-view-page" className="min-h-screen bg-rose-50/30 py-8 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Hotlines Header */}
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200 shrink-0">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Emergency Command &amp; SOS Center
              </h1>
              <p className="text-xs text-slate-500">
                Direct authority hotlines, one-touch SOS triggering, and location distribution
              </p>
            </div>
          </div>

          {/* Quick Call 911 / 112 Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <a
              id="emergency-call-911-btn"
              href="tel:911"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-rose-300 active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911</span>
            </a>

            <a
              id="emergency-call-112-btn"
              href="tel:112"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call 112</span>
            </a>
          </div>
        </div>

        {/* If SOS is currently active, showcase EmergencyCard at the top */}
        {activeSOS ? (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                Active Emergency Request In Progress
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Req ID: #{activeSOS.id.slice(-6)}
              </span>
            </div>
            <EmergencyCard request={activeSOS} isDetailed={true} />
          </div>
        ) : (
          /* SOS Trigger Widget */
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <SOSButton size="large" />
          </div>
        )}

        {/* Location & GPS Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LocationCard />

          {/* Emergency Contacts Quick Broadcast */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Notify Trusted Contacts</h4>
                    <p className="text-[11px] text-slate-500">
                      {contacts.length} emergency contacts configured
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Send a pre-formatted SMS containing your exact latitude, longitude, and map link to
                your designated family members or guardians.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              {contacts.length > 0 ? (
                contacts.map((c) => (
                  <a
                    key={c.id}
                    href={`sms:${c.phoneNumber.replace(/[^\d+]/g, '')}?body=${emergencySmsText}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>SMS {c.name.split(' ')[0]}</span>
                  </a>
                ))
              ) : (
                <a
                  href={`sms:?body=${emergencySmsText}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send SOS SMS to Anyone</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Immediate Responder Advice */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">What to Do While Emergency Help is En Route</h3>
              <p className="text-xs text-slate-400">Essential rules for personal and scene safety</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <strong className="text-rose-400 block font-bold">1. Stay in Safe Position</strong>
              <p className="text-slate-300">
                Move away from live traffic, falling debris, structural hazards, or spreading fire.
                Do not endanger yourself.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <strong className="text-rose-400 block font-bold">2. Give Precise Landmarks</strong>
              <p className="text-slate-300">
                When talking to dispatchers, state intersections, building color, floor level, and
                prominent signage near your GPS coordinates.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <strong className="text-rose-400 block font-bold">3. Keep Phone Line Open</strong>
              <p className="text-slate-300">
                Do not hang up with the 911 dispatcher until instructed. Turn on phone speaker mode
                so your hands are free for first aid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
