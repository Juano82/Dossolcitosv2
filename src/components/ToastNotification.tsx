import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  subMessage?: string;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  subMessage,
  onClose,
  onAction,
  actionLabel,
}) => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-stone-900 text-white p-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold leading-tight text-white">{message}</p>
        {subMessage && <p className="text-[11px] text-stone-300 mt-0.5 truncate">{subMessage}</p>}
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="mt-2 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 block"
          >
            {actionLabel} &rarr;
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
