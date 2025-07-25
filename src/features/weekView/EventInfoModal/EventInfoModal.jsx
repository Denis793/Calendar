import React, { useState } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Modal, ModalField, ModalActionButton } from '@/shared/ui/Modal';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { ShareEvent } from '@/entities/event/ShareEvent';
import modalStyles from '@/shared/ui/Modal/Modal.module.scss';
import styles from './EventInfoModal.module.scss';

export const EventInfoModal = ({ isOpen, onClose, event, onEdit, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isOpen || !event) {
    return null;
  }

  const handleEdit = () => {
    onEdit(event);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCloseShare = () => {
    setShowShareModal(false);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(event.id);
    setShowConfirmDelete(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const getEventDate = () => {
    try {
      if (!event.date) return 'No date specified';
      return format(new Date(event.date), 'EEEE, MMMM d, yyyy', { locale: uk });
    } catch {
      return 'Invalid date format';
    }
  };

  const getEventWeekDay = () => {
    try {
      if (!event.date) return 'Thursday';
      return format(new Date(event.date), 'EEEE', { locale: uk });
    } catch {
      return 'Thursday';
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Event information" size="medium">
        <div className={modalStyles.modalExtraActions}>
          <ModalActionButton icon="edit" variant="edit" onClick={handleEdit} title="Edit event" />
          <ModalActionButton icon="share" variant="primary" onClick={handleShare} title="Share event" />
          <ModalActionButton icon="delete" variant="delete" onClick={handleDeleteClick} title="Delete event" />
        </div>

        <div>
          <ModalField icon="title">
            <span className={styles.eventTitle}>{event.title || 'No title'}</span>
          </ModalField>

          <ModalField icon="time">
            <div className={styles.eventDate}>{getEventDate()}</div>
            <div className={styles.eventTime}>
              {event.startTime || '00:00'} - {event.endTime || '23:59'}
            </div>
            <div className={styles.eventRecurrence}>All day, Weekly on {getEventWeekDay()}</div>
          </ModalField>

          <ModalField icon="calendar">
            <div className={styles.calendarInfo}>
              <div className={styles.calendarColor} style={{ backgroundColor: event.color }}></div>
              <span className={styles.calendarName}>Calendar 1</span>
            </div>
          </ModalField>

          {event.description && (
            <ModalField icon="description">
              <span className={styles.eventDescription}>{event.description}</span>
            </ModalField>
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete event"
        message={`Are you sure you want to delete the event "${
          event?.title || 'this event'
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ShareEvent isOpen={showShareModal} onClose={handleCloseShare} event={event} />
    </>
  );
};
