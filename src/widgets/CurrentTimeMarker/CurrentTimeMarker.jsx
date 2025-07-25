import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import styles from './CurrentTimeMarker.module.scss';

const { HOUR_HEIGHT_REM, START_HOUR, END_HOUR, UPDATE_INTERVAL_MS, FORMAT_TIME } = CALENDAR_CONSTANTS;

export const CurrentTimeMarker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    if (currentHour < START_HOUR || currentHour >= END_HOUR) {
      return null;
    }

    const totalMinutes = (currentHour - START_HOUR) * 60 + currentMinute + currentSecond / 60;
    const position = (totalMinutes / 60) * HOUR_HEIGHT_REM;

    return position;
  };

  const position = getCurrentTimePosition();

  if (position === null) return null;

  return (
    <div className={styles.currentTimeLine} style={{ top: `${position}rem` }}>
      <div className={styles.currentTimeCircle} />
      <div className={styles.currentTimeText}>{format(currentTime, FORMAT_TIME)}</div>
    </div>
  );
};
