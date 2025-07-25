import React from 'react';
import { format } from 'date-fns';
import { Icon } from '@/shared/ui/Icons';
import { Button } from '@/shared/ui/Button';
import { Dropdown } from '@/shared/ui/Dropdown';
import { useDateStore } from '@/entities/date/dateStore';
import { AuthProvider } from '@/shared/api/firebase/auth.jsx';

import styles from './Header.module.scss';

export const Header = () => {
  const { currentDate, viewMode, goToToday, goToPrev, goToNext, setViewMode } = useDateStore();

  const displayDate = format(currentDate, 'MMMM yyyy');

  const handleViewChange = (value) => {
    setViewMode(value);
  };

  const viewModeOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerWrapper}>
            <div className={styles.headerContent}>
              <div className={styles.logo}>
                <Icon name="logo" size="55" />
                <p className={styles.logoTitle}>WebCalendar</p>
              </div>

              <Button onClick={goToToday}>Today</Button>

              <div className={styles.date}>
                <Button className={styles.button} onClick={goToPrev} variant="secondary">
                  <Icon name="arrowLeft" />
                </Button>

                <Button className={styles.button} onClick={goToNext} variant="secondary">
                  <Icon name="arrowRight" />
                </Button>

                <span className={styles.currentDate}>{displayDate}</span>
              </div>
            </div>

            <div className={styles.headerContent}>
              <Dropdown
                className={styles.dropdown}
                selected={viewMode}
                onSelect={handleViewChange}
                options={viewModeOptions}
              />
              <p className={styles.user}>Username</p>
            </div>

            <AuthProvider />
          </div>
        </div>
      </header>
    </>
  );
};
