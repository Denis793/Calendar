/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});
  const idRef = useRef(0);

  const showToast = useCallback(({ message, duration = 5000 }) => {
    const id = idRef.current++;
    const newToast = { id, message };

    setToasts((prev) => [...prev, newToast]);

    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete timers.current[id];
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = {
    toasts,
    showToast,
    removeToast,
  };

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
}

export default ToastProvider;
