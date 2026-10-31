import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, Phone, MapPin, Bot, Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-app-footer"
      className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 lg:pb-12 text-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                ResQ<span className="text-rose-500">Now</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered emergency response, location orchestration, and rapid situation guidance
              designed to keep individuals safe and connected when every second matters.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 px-2.5 py-1.5 rounded-lg">
              <Shield className="w-3.5 h-3.5" />
              <span>Built for High-Stakes Situations</span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/emergency" className="hover:text-white transition-colors">
                  One-Tap SOS Emergency
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-white transition-colors">
                  ResQ AI Safety Assistant
                </Link>
              </li>
              <li>
                <Link to="/nearby-help" className="hover:text-white transition-colors">
                  Nearby Hospitals &amp; Police
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-white transition-colors">
                  Emergency Contacts Directory
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Community Incident Reporting
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">
                  Emergency History Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Direct Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Immediate Helplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Emergency Services:</span>
                <a href="tel:911" className="text-rose-400 font-bold hover:underline">
                  911 / 112
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Poison Help:</span>
                <a href="tel:18002221222" className="text-slate-200 font-medium hover:underline">
                  1-800-222-1222
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Crisis &amp; Suicide Line:</span>
                <a href="tel:988" className="text-amber-400 font-bold hover:underline">
                  988
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Disaster Distress:</span>
                <a href="tel:18009855990" className="text-slate-200 font-medium hover:underline">
                  1-800-985-5990
                </a>
              </li>
            </ul>
          </div>

          {/* Critical Disclaimer */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
              Official Safety Disclaimer
            </span>
            <p className="text-[11px] text-slate-400 leading-normal">
              ResQNow provides situational guidance, location packaging, and automated logging.
              ResQNow is not a substitute for direct communication with official 911, 112, or local
              emergency dispatchers. In an active crisis, call emergency dispatch immediately.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ResQNow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Powered by <span className="text-slate-300 font-semibold">Google Gemini</span> &amp;{' '}
              <span className="text-slate-300 font-semibold">Firebase</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
