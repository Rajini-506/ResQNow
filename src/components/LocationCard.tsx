import React from 'react';
import {
  MapPin,
  RefreshCw,
  ExternalLink,
  Navigation,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { mapsService } from '../services/mapsService';

interface LocationCardProps {
  compact?: boolean;
  className?: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  compact = false,
  className = '',
}) => {
  const { coords, isLocating, locationError, refreshLocation } = useEmergency();
  const [copied, setCopied] = React.useState(false);

  const googleMapsUrl = mapsService.getGoogleMapsUrl(coords);

  const handleCopyCoords = () => {
    const text = `${coords.latitude}, ${coords.longitude}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="location-status-card"
      className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Your Current Location</h4>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Geolocation Sensor Active
            </span>
          </div>
        </div>

        <button
          id="refresh-location-btn"
          type="button"
          onClick={() => refreshLocation()}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          title="Refresh GPS Coordinates"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-rose-600' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Refresh'}</span>
        </button>
      </div>

      {locationError && (
        <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Notice:</span> {locationError}
          </div>
        </div>
      )}

      {/* Main Coordinate & Address Display */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Approximate Address / Landmark
          </span>
          <p className="text-xs font-semibold text-slate-900 leading-snug">
            {coords.address || 'Address lookup in progress...'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
          <div className="flex items-center gap-3 font-mono text-slate-700">
            <span>
              <strong className="text-slate-400 font-sans font-medium">LAT:</strong>{' '}
              {coords.latitude.toFixed(5)}
            </span>
            <span>
              <strong className="text-slate-400 font-sans font-medium">LNG:</strong>{' '}
              {coords.longitude.toFixed(5)}
            </span>
            {coords.accuracy && (
              <span className="text-[11px] text-slate-500 font-sans">
                (±{coords.accuracy}m)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyCoords}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-rose-600"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Coords</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Map Actions */}
      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <a
          id="open-google-maps-link"
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold hover:underline"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <span className="text-[11px] text-slate-400">
          Updated {new Date(coords.timestamp || Date.now()).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default LocationCard;
