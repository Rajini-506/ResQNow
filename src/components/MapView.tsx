import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ExternalLink,
  Shield,
  Activity,
  Flame,
  Search,
} from 'lucide-react';
import type { Coordinates, NearbyPlace } from '../types';
import { mapsService } from '../services/mapsService';

interface MapViewProps {
  coords: Coordinates;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({ coords, className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hospital' | 'Police' | 'Fire'>('All');
  const [facilities] = useState<NearbyPlace[]>(() => mapsService.getNearbyFacilities(coords));

  const filtered = facilities.filter(
    (f) => selectedCategory === 'All' || f.category === selectedCategory
  );

  return (
    <div
      id="emergency-map-view-container"
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${className}`}
    >
      {/* Map visual representation */}
      <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden">
        {/* OpenStreetMap interactive embed centered on exact coordinates */}
        <iframe
          title="Emergency Location Map"
          className="w-full h-full border-0 filter contrast-105"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.longitude - 0.03}%2C${coords.latitude - 0.02}%2C${coords.longitude + 0.03}%2C${coords.latitude + 0.02}&layer=mapnik&marker=${coords.latitude}%2C${coords.longitude}`}
          loading="lazy"
        />

        {/* Floating current location overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
          <span className="font-bold text-slate-900">Your GPS Pinpoint</span>
          <span className="text-slate-500 font-mono text-[11px]">
            {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
          </span>
        </div>

        {/* Quick Launch Google Maps */}
        <div className="absolute bottom-3 right-3">
          <a
            id="launch-full-google-maps-btn"
            href={mapsService.getGoogleMapsUrl(coords)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 text-white font-bold text-xs hover:bg-slate-900 shadow-lg backdrop-blur-xs transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-rose-400" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Facilities filter & list */}
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Verified Emergency Facilities Nearby
            </h4>
            <p className="text-xs text-slate-500">
              Calculated distances from your active coordinates
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['All', 'Hospital', 'Police', 'Fire'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((fac) => {
            const isHospital = fac.category === 'Hospital';
            const isPolice = fac.category === 'Police';
            const isFire = fac.category === 'Fire';

            const Icon = isHospital ? Activity : isPolice ? Shield : Flame;
            const iconColor = isHospital
              ? 'bg-rose-50 text-rose-600'
              : isPolice
              ? 'bg-blue-50 text-blue-600'
              : 'bg-orange-50 text-orange-600';

            const directionsUrl = mapsService.getDirectionsUrl(coords, fac.lat, fac.lng);

            return (
              <div
                key={fac.id}
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-slate-900 leading-tight">
                        {fac.name}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{fac.address}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {fac.distanceKm} km away
                      </span>
                      <span>• Est. {fac.estimatedDriveTime}</span>
                      <span className="text-slate-400">• {fac.openStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <a
                    href={`tel:${fac.phone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-800 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-rose-600" />
                    <span>Call Desk</span>
                  </a>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors ml-auto"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapView;
