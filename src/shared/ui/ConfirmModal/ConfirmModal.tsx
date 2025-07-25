import React from 'react';
import { Modal } from '../Modal/Modal';
import Button from '../Button/Button';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className={styles.confirmContent} data-testid="confirm-content">
        <div className={styles.textContent}>
          <p className={styles.confirmMessage} data-testid="confirm-message">
            {message}
          </p>
        </div>

        <div className={styles.buttonGroup} data-testid="button-group">
          <Button variant="secondary" onClick={onClose} data-testid="cancel-button">
            {cancelText}
          </Button>
          <Button variant="primary" onClick={handleConfirm} data-testid="confirm-button">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
