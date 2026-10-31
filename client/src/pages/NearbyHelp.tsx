import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Search,
  ExternalLink,
  Shield,
  Activity,
  Flame,
  Hospital,
  RefreshCw,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { mapsService } from '../services/mapsService';
import MapView from '../components/MapView';

export const NearbyHelp: React.FC = () => {
  const { coords, isLocating, refreshLocation } = useEmergency();

  const handleOpenGoogleMapsSearch = (type: 'hospitals' | 'police' | 'fire') => {
    const url = mapsService.getEmergencySearchUrl(type, coords);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="nearby-help-page" className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Nearby Emergency Facilities
              </h1>
              <p className="text-xs text-slate-500">
                Trauma ERs, police precincts, and fire rescue stations mapped from your current GPS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-coords-btn"
              type="button"
              onClick={() => refreshLocation()}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-rose-600' : ''}`} />
              <span>{isLocating ? 'Updating GPS...' : 'Refresh Location'}</span>
            </button>
          </div>
        </div>

        {/* Quick Google Maps Emergency Search Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleOpenGoogleMapsSearch('hospitals')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Hospital Emergency Rooms</h3>
                <span className="text-[11px] text-slate-500">Open in Google Maps &rarr;</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenGoogleMapsSearch('police')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Police Precinct Stations</h3>
                <span className="text-[11px] text-slate-500">Open in Google Maps &rarr;</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenGoogleMapsSearch('fire')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Fire &amp; Rescue Stations</h3>
                <span className="text-[11px] text-slate-500">Open in Google Maps &rarr;</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-600" />
          </button>
        </div>

        {/* Map View & List of Verified Facilities */}
        <MapView coords={coords} />
      </div>
    </div>
  );
};

export default NearbyHelp;
