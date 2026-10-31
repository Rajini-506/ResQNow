import React, { useEffect, useState } from 'react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isUrgent?: boolean;
  countdownSeconds?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isUrgent = false,
  countdownSeconds,
  onConfirm,
  onCancel,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(countdownSeconds || null);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(countdownSeconds || null);
      return;
    }

    if (countdownSeconds && countdownSeconds > 0) {
      setSecondsLeft(countdownSeconds);
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            onConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, countdownSeconds, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      id="confirmation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="confirmation-modal-content"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 text-slate-800"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                isUrgent ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isUrgent ? (
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              {secondsLeft !== null && secondsLeft > 0 && (
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Auto-triggering in {secondsLeft}s
                </span>
              )}
            </div>
          </div>
          <button
            id="close-confirmation-modal"
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">{message}</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            id="cancel-confirmation-button"
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            id="confirm-action-button"
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all ${
              isUrgent
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-rose-200'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
