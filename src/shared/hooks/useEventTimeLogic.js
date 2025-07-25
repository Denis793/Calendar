import { useMemo, useCallback } from 'react';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';

const { START_HOUR, END_HOUR, INTERVAL_MINUTES } = CALENDAR_CONSTANTS;

export const useEventTimeLogic = (startTime, endTime, setEndTime, dayEvents = []) => {
  const timeToMinutes = (timeString) => {
    if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const generateTimeOptions = useCallback(() => {
    const times = [];
    const interval = INTERVAL_MINUTES;
    for (let i = START_HOUR; i <= END_HOUR; i++) {
      for (let j = 0; j < 60; j += interval) {
        if (i === END_HOUR && j > 0) continue;
        const currentTimeInMinutes = i * 60 + j;
        times.push({
          label: minutesToTime(currentTimeInMinutes),
          value: minutesToTime(currentTimeInMinutes),
        });
      }
    }
    return times;
  }, []);

  const allTimeOptions = useMemo(() => generateTimeOptions(), [generateTimeOptions]);

  const busySlots = useMemo(() => {
    if (!Array.isArray(dayEvents)) return [];
    const busy = new Set();
    dayEvents.forEach((event) => {
      const start = timeToMinutes(event.startTime);
      const end = timeToMinutes(event.endTime);
      for (let t = start; t < end; t += INTERVAL_MINUTES) {
        busy.add(minutesToTime(t));
      }
    });
    return busy;
  }, [dayEvents]);

  const allTimeOptionsWithBusy = useMemo(() => {
    return allTimeOptions.map((opt) => ({
      ...opt,
      isBusy: busySlots.has(opt.value),
    }));
  }, [allTimeOptions, busySlots]);

  const endTimeOptions = useMemo(() => {
    if (!startTime) return allTimeOptionsWithBusy;

    const currentStartTimeInMinutes = timeToMinutes(startTime);
    const minEndTimeInMinutes = currentStartTimeInMinutes + INTERVAL_MINUTES;

    const filteredOptions = allTimeOptionsWithBusy.filter((option) => {
      return timeToMinutes(option.value) >= minEndTimeInMinutes;
    });

    if (filteredOptions.length > 0 && timeToMinutes(endTime) < minEndTimeInMinutes) {
      setEndTime(filteredOptions[0].value);
    } else if (filteredOptions.length === 0) {
      if (timeToMinutes(endTime) < minEndTimeInMinutes) {
        setEndTime('');
      }
    }

    return filteredOptions;
  }, [startTime, allTimeOptionsWithBusy, endTime, setEndTime]);

  const validateTimeRange = (start, end) => {
    if (!start || !end) return false;

    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    return (
      endMinutes > startMinutes &&
      endMinutes - startMinutes >= INTERVAL_MINUTES &&
      startMinutes >= timeToMinutes(`${START_HOUR.toString().padStart(2, '0')}:00`) &&
      endMinutes <= timeToMinutes(`${END_HOUR.toString().padStart(2, '0')}:00`)
    );
  };

  const getValidEndTime = (start) => {
    if (!start) return '';

    const startMinutes = timeToMinutes(start);
    const minEndMinutes = startMinutes + INTERVAL_MINUTES;

    const validOption = allTimeOptionsWithBusy.find((option) => timeToMinutes(option.value) >= minEndMinutes);

    return validOption ? validOption.value : '';
  };

  return {
    allTimeOptions: allTimeOptionsWithBusy,
    endTimeOptions,
    validateTimeRange,
    getValidEndTime,
    timeToMinutes,
    minutesToTime,
  };
};
