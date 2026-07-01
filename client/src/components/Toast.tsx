import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Global emitter mechanism
let toastCount = 0;
const listeners = new Set<(message: ToastMessage) => void>();

export const toast = {
  success: (msg: string) => emit('success', msg),
  error: (msg: string) => emit('error', msg),
  info: (msg: string) => emit('info', msg),
};

const emit = (type: ToastType, message: string) => {
  const id = `${Date.now()}-${toastCount++}`;
  const newMsg = { id, type, message };
  listeners.forEach((listener) => listener(newMsg));
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (newMsg: ToastMessage) => {
      setToasts((prev) => [...prev, newMsg]);
      // Auto-remove after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newMsg.id));
      }, 4000);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-in ${
            t.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'
              : t.type === 'error'
              ? 'bg-rose-500/20 border-rose-500/30 text-rose-200'
              : 'bg-violet-500/20 border-violet-500/30 text-violet-200'
          }`}
        >
          {t.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />}
          {t.type === 'error' && <XCircle className="h-5 w-5 shrink-0 text-rose-400" />}
          {t.type === 'info' && <AlertCircle className="h-5 w-5 shrink-0 text-violet-400" />}
          
          <p className="text-sm font-medium grow leading-tight text-slate-800 dark:text-slate-100">{t.message}</p>
          
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
