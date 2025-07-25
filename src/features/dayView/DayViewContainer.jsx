import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { DayView } from '../DayView';
import { Icon } from '@/shared/ui/Icons';
import { Button } from '@/shared/ui/Button';
import { EventForm } from '@/entities/event/EventForm';
import { EventEditor } from '@/entities/event/EventEditor';
import { useEventStore } from '@/entities/event/eventStore';
import { useModalStore } from '@/shared/lib/useModal';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import styles from './DayViewContainer.module.scss';

const { FORMAT_DATE } = CALENDAR_CONSTANTS;

export const DayViewContainer = () => {
  const [currentDate, setCurrentDate] = useState(format(new Date(), FORMAT_DATE));

  const addEvent = useEventStore((state) => state.addEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const { openModal, closeModal } = useModalStore();

  const prevDay = () => {
    setCurrentDate((date) => format(addDays(new Date(date), -1), FORMAT_DATE));
  };

  const nextDay = () => {
    setCurrentDate((date) => format(addDays(new Date(date), 1), FORMAT_DATE));
  };

  const handleOpenAddEventModal = () => {
    openModal('Add an event', EventForm, {
      initialData: { date: new Date(currentDate) },
      onSubmit: handleEventFormSubmit,
    });
  };

  const handleOpenEditEventModal = (event) => {
    openModal('Edit event', EventEditor, {
      initialData: event,
      onSubmit: handleEventFormSubmit,
    });
  };

  const handleEventFormSubmit = (formData) => {
    if (formData.id) {
      updateEvent(formData);
    } else {
      addEvent(formData);
    }
    closeModal();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button onClick={prevDay} variant="secondary">
          <Icon name="arrowLeft"></Icon>
        </Button>
        <span>{format(new Date(currentDate), 'PPPP')}</span>
        <Button onClick={nextDay} variant="secondary">
          <Icon name="arrowRight"></Icon>
        </Button>
        <Button onClick={handleOpenAddEventModal} variant="primary">
          Add an event
        </Button>
      </header>
      <DayView date={currentDate} onEventClick={handleOpenEditEventModal} />
    </div>
  );
};
