import React from 'react';
import { useDateStore } from '@/entities/date/dateStore';
import { WeekGrid } from '../WeekGrid';
import styles from './WeekView.module.scss';

export const WeekView = () => {
  const { currentDate } = useDateStore();

  return (
    <div className={styles.weekView}>
      <WeekGrid date={currentDate} />
    </div>
  );
};
