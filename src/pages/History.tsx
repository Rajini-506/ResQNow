import React from 'react';
import { Clock, Shield, Filter, FileText } from 'lucide-react';
import EmergencyHistory from '../components/EmergencyHistory';

export const History: React.FC = () => {
  return (
    <div id="history-page" className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Emergency &amp; Incident History
              </h1>
              <p className="text-xs text-slate-500">
                Auditable records of previous SOS alerts, reported incidents, and GPS coordinates
              </p>
            </div>
          </div>
        </div>

        {/* History Component */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <EmergencyHistory />
        </div>
      </div>
    </div>
  );
};

export default History;
