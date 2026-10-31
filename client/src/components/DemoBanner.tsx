import React, { useState } from 'react';
import { X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <aside
      id="demo-status-banner"
      aria-label="Pure MERN Architecture Status"
      className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 sm:px-6 lg:px-8 relative z-30 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Left: PURE MERN STACK badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 text-[11px] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Emergency Response & Assistance Platform
          </span>
        </div>

        {/* Right: Dismiss button */}
        <button
          id="close-demo-banner-btn"
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default DemoBanner;
