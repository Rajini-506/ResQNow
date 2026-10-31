import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Bot,
  MapPin,
  Users,
  FileText,
  Clock,
  PhoneCall,
  Activity,
  Heart,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import SOSButton from '../components/SOSButton';
import LocationCard from '../components/LocationCard';
import EmergencyCard from '../components/EmergencyCard';

export const Dashboard: React.FC = () => {
  const { userProfile, isDemoMode } = useAuth();
  const { activeSOS, contacts, sosHistory } = useEmergency();

  return (
    <div id="dashboard-page" className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Welcome / Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Welcome, {userProfile?.fullName || 'Responder'}
              </h1>
              {isDemoMode && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              System monitoring active • Ready for emergency dispatch and immediate guidance
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              id="dashboard-view-contacts-btn"
              to="/contacts"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-rose-600" />
              <span>{contacts.length} Contacts</span>
            </Link>

            <Link
              id="dashboard-open-assistant-btn"
              to="/assistant"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>ResQ AI</span>
            </Link>
          </div>
        </div>

        {/* Active Emergency Alert if present */}
        {activeSOS && (
          <div className="animate-fade-in">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                Active Emergency In Progress
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Initiated: {new Date(activeSOS.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <EmergencyCard request={activeSOS} isDetailed={true} />
          </div>
        )}

        {/* Main Grid: Left SOS & Location, Right Actions & Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Primary SOS & Sensor readings (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* SOS Hero Trigger Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-sm relative overflow-hidden">
              <SOSButton size="large" />
            </div>

            {/* GPS Location Sensor */}
            <LocationCard />
          </div>

          {/* Right Column: Quick Navigation & Services (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Action Bento Grid */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Emergency Response Tools
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  id="bento-nearby-help"
                  to="/nearby-help"
                  className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col justify-between group"
                >
                  <MapPin className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Nearby Facilities</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">ER, Police &amp; Fire</p>
                  </div>
                </Link>

                <Link
                  id="bento-ai-chat"
                  to="/assistant"
                  className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all flex flex-col justify-between group"
                >
                  <Bot className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">ResQ AI Chat</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">First-aid guidance</p>
                  </div>
                </Link>

                <Link
                  id="bento-contacts"
                  to="/contacts"
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex flex-col justify-between group"
                >
                  <Users className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Guardians</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{contacts.length} Configured</p>
                  </div>
                </Link>

                <Link
                  id="bento-report"
                  to="/report"
                  className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 hover:border-amber-300 hover:bg-amber-50 transition-all flex flex-col justify-between group"
                >
                  <FileText className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Log Incident</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">AI Photo &amp; Report</p>
                  </div>
                </Link>
              </div>

              {/* Direct Dial Emergency Dispatch Line */}
              <div className="pt-3 border-t border-slate-100">
                <a
                  id="dashboard-call-dispatch-now"
                  href="tel:911"
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4" />
                    <span>Dial Emergency Dispatch</span>
                  </div>
                  <span className="bg-rose-700/80 px-2 py-0.5 rounded text-[11px]">911 / 112</span>
                </a>
              </div>
            </div>

            {/* Medical Snapshot Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Medical ID Snapshot
                  </h4>
                </div>
                <Link
                  to="/profile"
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Blood Group
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {userProfile?.bloodType || 'Not specified'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Allergies
                  </span>
                  <span className="font-medium text-slate-700 truncate block">
                    {userProfile?.allergies || 'None listed'}
                  </span>
                </div>
              </div>

              {userProfile?.emergencyNotes && (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong>Notes:</strong> {userProfile.emergencyNotes}
                </p>
              )}
            </div>

            {/* Recent Emergency Activity Snippet */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent SOS History
                </h4>
                <Link to="/history" className="text-xs text-slate-500 hover:text-slate-900 font-semibold">
                  View All &rarr;
                </Link>
              </div>

              {sosHistory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent emergency logs.</p>
              ) : (
                <div className="space-y-2">
                  {sosHistory.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span className="font-bold text-slate-900">{item.type} Alert</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
