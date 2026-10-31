import React, { useState, useEffect } from 'react';
import {
  Clock,
  ShieldAlert,
  FileText,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  X,
} from 'lucide-react';
import type { EmergencyRequest, IncidentReport } from '../types';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { incidentAPI } from '../services/api';
import { mapsService } from '../services/mapsService';

type FilterType = 'all' | 'sos' | 'reports';

export const EmergencyHistory: React.FC = () => {
  const { sosHistory } = useEmergency();
  const { currentUser } = useAuth();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<{
    kind: 'sos' | 'report';
    date: Date;
    data: EmergencyRequest | IncidentReport;
  } | null>(null);

  useEffect(() => {
    if (currentUser) {
      incidentAPI
        .getAll()
        .then((res) => {
          if (res.success && Array.isArray(res.incidents)) {
            const mapped: IncidentReport[] = res.incidents.map((i: any) => ({
              id: i.id || i._id,
              userId: i.userId,
              type: i.type,
              description: i.description,
              location: {
                latitude: i.latitude || 0,
                longitude: i.longitude || 0,
                address: i.address || '',
              },
              dateTime: i.createdAt || new Date().toISOString(),
              imageBase64: i.imageUrl || undefined,
              aiClassification: i.aiClassification,
              status: i.status || 'Submitted',
              createdAt: i.createdAt || new Date().toISOString(),
            }));
            setReports(mapped);
          }
        })
        .catch((err) => {
          console.warn('Axios load incidents error:', err);
        });
    }
  }, [currentUser]);

  // Combine and sort by date descending
  const combined = [
    ...sosHistory.map((item) => ({ kind: 'sos' as const, date: new Date(item.timestamp), data: item })),
    ...reports.map((item) => ({ kind: 'report' as const, date: new Date(item.createdAt || item.dateTime), data: item })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filtered = combined.filter((item) => {
    if (filter === 'sos') return item.kind === 'sos';
    if (filter === 'reports') return item.kind === 'report';
    return true;
  });

  return (
    <>
      <div id="emergency-history-container" className="space-y-4">
        {/* Filter bar */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Clock className="w-4 h-4 text-rose-600" />
            <span>Emergency Activity Records ({filtered.length})</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('sos')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'sos' ? 'bg-white text-rose-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SOS Alerts
            </button>
            <button
              type="button"
              onClick={() => setFilter('reports')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'reports' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* List of Records */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No emergency records logged yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Activated SOS requests and submitted incident reports will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, idx) => {
              const isSOS = item.kind === 'sos';
              const sosData = isSOS ? (item.data as EmergencyRequest) : null;
              const repData = !isSOS ? (item.data as IncidentReport) : null;

              const title = isSOS ? `SOS: ${sosData?.type} Alert` : `Report: ${repData?.type}`;
              const desc = isSOS
                ? sosData?.additionalDetails || 'Emergency request triggered via ResQNow SOS button.'
                : repData?.description;
              const status = isSOS ? sosData?.status : repData?.status;
              const address = isSOS ? sosData?.location.address : repData?.location.address;

              return (
                <div
                  key={`${item.kind}-${item.data.id}-${idx}`}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSOS
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSOS ? (
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            status === 'created' || status === 'active'
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 max-w-md">{desc}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {address && (
                          <span className="flex items-center gap-1 max-w-[200px] truncate">
                            <MapPin className="w-3 h-3" />
                            {address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-2 text-slate-400">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          id="history-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2.5 rounded-xl ${
                    selectedItem.kind === 'sos'
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {selectedItem.kind === 'sos' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedItem.kind === 'sos' ? 'SOS Event Record' : 'Incident Report Record'}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Reference ID: #{selectedItem.data.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-slate-900">{selectedItem.data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-extrabold uppercase text-rose-700">
                  {selectedItem.data.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recorded Timestamp:</span>
                <span className="font-medium text-slate-800">
                  {selectedItem.date.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-0.5">Location:</span>
                <span className="font-mono text-slate-800 block">
                  {selectedItem.data.location.latitude.toFixed(5)},{' '}
                  {selectedItem.data.location.longitude.toFixed(5)}
                </span>
                {selectedItem.data.location.address && (
                  <span className="text-slate-600 block mt-0.5">
                    {selectedItem.data.location.address}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-xs">
              <span className="font-bold text-slate-900 block mb-1">Incident Summary &amp; Notes:</span>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedItem.kind === 'sos'
                  ? (selectedItem.data as EmergencyRequest).additionalDetails || 'No additional text provided during initial SOS trigger.'
                  : (selectedItem.data as IncidentReport).description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={mapsService.getGoogleMapsUrl(selectedItem.data.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-bold hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyHistory;
