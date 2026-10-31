import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Flame,
  Activity,
  Bot,
  MapPin,
  Users,
  FileText,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import SOSButton from '../components/SOSButton';

export const Landing: React.FC = () => {
  const { currentUser, enableDemoUser } = useAuth();
  const { activeSOS } = useEmergency();
  const navigate = useNavigate();

  const handleQuickDemo = () => {
    enableDemoUser();
    navigate('/dashboard');
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/20 to-slate-50 border-b border-slate-200 pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Subtle decorative grid/glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-100/40 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>AI-Powered Emergency Response &amp; Assistance Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Rapid Response When <span className="text-rose-600">Seconds Matter.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              ResQNow connects you to emergency assistance with one-tap SOS activation, real-time
              GPS coordination, trusted contact alerts, and instant Gemini AI first-response
              guidance.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                id="hero-sos-btn"
                to="/emergency"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all"
              >
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <span>Go to SOS Emergency</span>
              </Link>

              {currentUser ? (
                <Link
                  id="hero-dashboard-btn"
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all"
                >
                  <span>Open My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  id="hero-demo-login-btn"
                  type="button"
                  onClick={handleQuickDemo}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all"
                >
                  <span>Quick Demo Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Direct 911 Call Link for immediate emergencies */}
            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Life-threatening emergency? Call</span>
              <a href="tel:911" className="text-rose-600 font-extrabold underline hover:text-rose-700">
                911 (US/Canada)
              </a>
              <span>or</span>
              <a href="tel:112" className="text-rose-600 font-extrabold underline hover:text-rose-700">
                112 (EU/Global)
              </a>
            </div>
          </div>

          {/* Central Interactive SOS Showcase */}
          <div className="mt-12 max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative">
            <SOSButton size="large" />
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-2">
            Integrated Emergency Suite
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Critical Clarity Under Pressure
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            From instant panic activation to AI-assisted scene triage, every tool is built to
            perform quickly and reliably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-200 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">One-Tap SOS Activation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Triggers verified emergency requests with precise GPS sensor readings and packaged
              alerts for immediate distribution.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-200 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Nearby Emergency Facilities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant distance calculations and turn-by-turn routing to the nearest ER trauma
              centers, police precincts, and fire stations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-200 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ResQ AI Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini-powered situational guidance provides clear step-by-step checklists for severe
              bleeding, burns, CPR, or choking.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-200 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Emergency Contacts Network</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Store trusted family and guardian contacts with one-tap direct calling and pre-composed
              SMS location dispatches.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-200 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Incident Documentation &amp; Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log accident details, record photographic evidence, and run Gemini visual assessments
              for scene safety analysis.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-200 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Emergency History Logs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Auditable records of previous incidents, timestamps, and locations for insurance,
              law enforcement, and medical records.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-2">
              Three-Step Response Protocol
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How ResQNow Protects You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-rose-200">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Press the SOS Trigger</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose the incident category (Medical, Accident, Fire, Safety). The app instantly
                captures high-accuracy GPS coordinates.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Alert Contacts &amp; Call Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use one-touch hotlines to connect to 911 or dispatch pre-composed SOS messages with
                live Google Maps location links to your family.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Receive Real-Time Guidance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consult ResQ AI for safe first-aid actions while you wait for arrival, or navigate
                directly to the closest trauma hospital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Banner */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-extrabold text-lg text-white">
              Always Call Official Emergency Dispatch in Crisis
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              ResQNow provides situational organization, GPS tracking, and AI safety guidance.
              It does not replace civil PSAP dispatchers. If someone is in immediate danger, dial
              911 or 112 immediately.
            </p>
          </div>

          <a
            href="tel:911"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950 transition-all shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 911 Now</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Landing;
