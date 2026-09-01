import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinancial();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let border = 'border-cyan-500/30';
        let bg = 'bg-slate-900/95';
        let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;

        if (toast.type === 'success') {
          border = 'border-emerald-500/40';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          border = 'border-amber-500/40';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.type === 'error') {
          border = 'border-rose-500/40';
          icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${border} ${bg} backdrop-blur-lg shadow-card-elevated text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-200`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
