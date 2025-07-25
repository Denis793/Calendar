import React from 'react';
import { Modal } from '@/shared/ui/Modal';
import { EventForm } from '@/features/eventForm';

export const EventFormModal = ({
  isOpen,
  onClose,
  event = null,
  title = null,
  availableHours,
  defaultDate,
  defaultTime,
  defaultCalendarId,
  activeCalendarId,
}) => {
  const modalTitle = title || (event ? 'Edit event' : 'Create event');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="large">
      <EventForm
        event={event}
        onClose={onClose}
        availableHours={availableHours}
        defaultDate={defaultDate}
        defaultTime={defaultTime}
        defaultCalendarId={defaultCalendarId}
        activeCalendarId={activeCalendarId}
      />
    </Modal>
  );
};
