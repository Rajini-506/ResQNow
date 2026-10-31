import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import IncidentForm from '../components/IncidentForm';

export const Report: React.FC = () => {
  return (
    <div id="incident-reporting-page" className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Urgent Emergency Warning Banner */}
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 animate-pulse" />
            <div className="text-xs">
              <strong className="block text-sm font-bold text-rose-900">
                Is this an active life-threatening crisis?
              </strong>
              <span>
                Do not fill out forms during an active danger. Trigger SOS or dial 911 / 112 immediately.
              </span>
            </div>
          </div>

          <Link
            to="/emergency"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0"
          >
            <span>Emergency SOS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Main Incident Form Component */}
        <IncidentForm />
      </div>
    </div>
  );
};

export default Report;
