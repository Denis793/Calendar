import React from 'react';
import { Icon } from '@/shared/ui/Icons';
import { Dropdown } from '@/shared/ui/Dropdown';
import { darkenColor } from '@/utils/colorUtils';
import styles from '../EventForm.module.scss';

export const EventCalendarColorSection = ({
  calendar,
  setCalendar,
  calendarOptions,
  eventColor,
  setIsColorPickerModalOpen,
}) => {
  return (
    <div className={styles.formRow}>
      <Icon className="icon" name="calendar" />
      <div className={styles.colorPickerWrapper}>
        <div
          className={styles.colorPreview}
          style={{
            backgroundColor: eventColor,
            borderColor: darkenColor(eventColor, 0.3),
          }}
          onClick={() => setIsColorPickerModalOpen(true)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Calendar</label>
        <Dropdown options={calendarOptions} selected={calendar} onSelect={setCalendar} />
      </div>
    </div>
  );
};
