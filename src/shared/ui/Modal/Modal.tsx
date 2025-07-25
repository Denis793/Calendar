import React, { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/shared/ui/Icons/Icons';
import type { IconName } from '@/shared/ui/Icons/Icons';
import classNames from 'classnames';
import styles from './Modal.module.scss';

type ModalSize = 'small' | 'medium' | 'large' | 'xlarge';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
  size?: ModalSize;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  showCloseButton = true,
  size = 'large',
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const extraActions = React.Children.toArray(children).find((child) => {
    return (
      React.isValidElement(child) &&
      child.type === 'div' &&
      (child.props as any)?.className === styles.modalExtraActions
    );
  });

  const contentChildren = React.Children.toArray(children).filter(
    (child) =>
      !(
        React.isValidElement(child) &&
        child.type === 'div' &&
        (child.props as any)?.className === styles.modalExtraActions
      )
  );

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={classNames(styles.modal, styles[`modal--${size}`], className)}
        onClick={(e) => e.stopPropagation()}
        data-testid="modal"
      >
        {(title || showCloseButton || extraActions) && (
          <div className={styles.modalHeader}>
            {title && <h2 className={styles.modalTitle}>{title}</h2>}
            <div className={styles.modalActions}>
              {extraActions && React.isValidElement(extraActions) && (extraActions.props as any)?.children}
              {showCloseButton && <Icon className="icon" onClick={onClose} title="Close modal" name="close" />}
            </div>
          </div>
        )}
        <div className={styles.modalContent}>{contentChildren}</div>
      </div>
    </div>,
    document.body
  );
};

interface ModalFieldProps {
  icon: IconName;
  children: ReactNode;
  className?: string;
}

export const ModalField: React.FC<ModalFieldProps> = ({ icon, children, className }) => {
  return (
    <div className={classNames(styles.modalField, className)} data-testid="modal-field">
      <Icon className="icon" name={icon} />
      <div className={styles.modalFieldContent}>{children}</div>
    </div>
  );
};

interface ModalActionButtonProps {
  icon: IconName;
  onClick: () => void;
  title: string;
}

export const ModalActionButton: React.FC<ModalActionButtonProps> = ({ icon, onClick, title }) => {
  return <Icon className="icon" onClick={onClick} title={title} name={icon} />;
};
