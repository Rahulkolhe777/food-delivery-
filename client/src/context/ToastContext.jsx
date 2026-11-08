import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '@/components/ui/Toast';

let toastCounter = 0;

function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload];
    case 'REMOVE_TOAST':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const dismiss = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = ++toastCounter;
      dispatch({ type: 'ADD_TOAST', payload: { id, type, title, message } });
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (title, message, options) => toast({ type: 'success', title, message, ...options }),
    [toast]
  );
  const error = useCallback(
    (title, message, options) => toast({ type: 'error', title, message, ...options }),
    [toast]
  );
  const warning = useCallback(
    (title, message, options) => toast({ type: 'warning', title, message, ...options }),
    [toast]
  );
  const info = useCallback(
    (title, message, options) => toast({ type: 'info', title, message, ...options }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast {...t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
