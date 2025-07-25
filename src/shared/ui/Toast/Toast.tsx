import React from 'react';
import { Icon } from '../Icons';
import styles from './Toast.module.scss';
import classNames from 'classnames';

interface ToastProps {
  message: string;
  onClose: () => void;
  className?: string;
  'data-testid'?: string;
}

export function Toast({ message, onClose, className, 'data-testid': testId }: ToastProps) {
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className={classNames(styles.toast, className)} data-testid={testId}>
      <span data-testid="toast-message" className={styles.toastMessage}>
        {message}
      </span>
      <Icon
        className={styles.closeIcon}
        name="close"
        tabIndex={0}
        aria-label="Close toast"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="button"
        size={24}
      />
    </div>
  );
}

export default Toast;
