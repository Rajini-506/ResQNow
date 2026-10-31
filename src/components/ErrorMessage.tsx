import React from 'react';
import { AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'System Notice',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      id="error-message-box"
      className={`rounded-xl border border-rose-200 bg-rose-50/90 p-4 text-rose-900 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-950">{title}</h4>
          <p className="mt-1 text-sm text-rose-800 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              id="retry-action-button"
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Operation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
