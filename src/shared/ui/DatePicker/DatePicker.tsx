import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns';
import { Icon } from '../Icons';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  occupiedDates?: Date[];
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange, occupiedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const renderHeader = () => (
    <div className={styles.header} data-testid="datepicker-header">
      <span className={styles.titleMonths}>{format(currentMonth, 'MMMM yyyy')}</span>

      <div className={styles.controlSection}>
        <Icon
          className={styles.arrow}
          name="arrowLeft"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          data-testid="prev-month-button"
        />
        <Icon
          className={styles.arrow}
          name="arrowRight"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          data-testid="next-month-button"
        />
      </div>
    </div>
  );

  const renderDays = () => {
    const startDate = startOfWeek(currentMonth);
    return (
      <div className={styles.daysRow} data-testid="days-row">
        {[...Array(7)].map((_, i) => (
          <div key={i} className={styles.dayLabel}>
            {format(addDays(startDate, i), 'E')}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = startOfDay(new Date());

    let day = startDate;
    const rows = [];

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const dayStartOfDay = startOfDay(day);

        const isPastDate = isBefore(dayStartOfDay, today);
        const isOccupied = occupiedDates.some((occupiedDate) => isSameDay(occupiedDate, day));
        const isDisabled = isPastDate;

        days.push(
          <div
            key={day.toString()}
            className={classNames(styles.cell, {
              [styles.inactive]: !isCurrentMonth,
              [styles.selected]: isSelected,
              [styles.disabled]: isDisabled,
              [styles.past]: isPastDate,
              [styles.occupied]: isOccupied && !isPastDate,
            })}
            onClick={() => !isDisabled && onDateChange(cloneDay)}
            style={{
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            title={isOccupied ? 'This date has events' : ''}
            data-testid={`date-cell-${format(day, 'yyyy-MM-dd')}`}
          >
            {format(day, 'd')}
            {isOccupied && !isPastDate && <div className={styles.occupiedDot} data-testid="occupied-dot"></div>}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className={styles.weekRow}>
          {days}
        </div>
      );
    }

    return <div data-testid="calendar-grid">{rows}</div>;
  };

  return (
    <div className={styles.datePicker} data-testid="datepicker-container">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default DatePicker;
