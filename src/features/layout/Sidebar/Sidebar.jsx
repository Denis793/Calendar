import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { DatePicker } from '@/shared/ui/DatePicker';
import { Icon } from '@/shared/ui/Icons';
import { Button } from '@/shared/ui/Button';
import { useDateStore } from '@/entities/date/dateStore';
import { CalendarList } from '@/entities/calendar/CalendarList';
import { Modal } from '@/shared/ui/Modal';
import { EventForm } from '@/features/eventForm';

export const Sidebar = () => {
  const { currentDate, setCurrentDate } = useDateStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <Button className={styles.button} variant="primary" onClick={openModal}>
          + Create
        </Button>

        <DatePicker selectedDate={currentDate} onDateChange={handleDateChange} />

        <CalendarList />

        <Modal isOpen={isModalOpen} onClose={closeModal} title="Create event">
          <EventForm onClose={closeModal} />
        </Modal>
      </aside>
    </>
  );
};
