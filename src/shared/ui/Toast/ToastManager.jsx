import React from 'react';
import { useToast } from './ToastContext';
import Toast from './Toast';
import styles from './Toast.module.scss';

export default function ToastManager() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}
