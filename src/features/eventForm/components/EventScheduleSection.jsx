import React from 'react';
import { Icon } from '@/shared/ui/Icons';
import { SelectMenu } from '@/shared/ui/SelectMenu';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Dropdown } from '@/shared/ui/Dropdown';
import { format } from 'date-fns';
import styles from '../EventForm.module.scss';
import { getRepeatDates } from '@/utils/repeatUtils';

export const EventScheduleSection = ({
  date,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  allDay,
  setAllDay,
  repeat,
  setRepeat,
  setIsDatePickerModalOpen,
  allTimeOptions,
  endTimeOptions,
  repeatOptions,
  onRepeatPreview,
}) => {
  const handleRepeatChange = (value) => {
    setRepeat(value);
    if (onRepeatPreview) {
      const dates = getRepeatDates(date, value, 5);
      onRepeatPreview(dates);
    }
  };

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime);

    if (!endTime || newStartTime >= endTime) {
      const timeToMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const minutesToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };

      const startMinutes = timeToMinutes(newStartTime);
      const newEndMinutes = startMinutes + 60;
      const newEndTime = minutesToTime(newEndMinutes);

      const validEndTime = endTimeOptions.find((option) => option.value >= newEndTime);
      const finalEndTime = validEndTime ? validEndTime.value : endTimeOptions[0]?.value || newEndTime;

      setEndTime(finalEndTime);
    }
  };

  return (
    <>
      <div className={styles.formRow}>
        <Icon className="icon" name="time" />
        <div className={styles.inputGroup}>
          <label className={styles.label}>Date</label>
          <div className={styles.datePreview} onClick={() => setIsDatePickerModalOpen(true)}>
            {format(date, 'EEEE, MMMM do')}
          </div>
        </div>

        <div className={styles.timeSelectGroup}>
          <label className={styles.label}>Time</label>
          <div className={styles.timeGroup}>
            <SelectMenu
              className={styles.selectMenu}
              options={allTimeOptions}
              value={startTime}
              onChange={handleStartTimeChange}
              width={100}
            />
            <span className={styles.timeSeparator}>-</span>
            <SelectMenu
              className={styles.selectMenu}
              options={endTimeOptions}
              value={endTime}
              onChange={setEndTime}
              width={100}
            />
          </div>
        </div>
      </div>

      <div className={styles.checkboxSection}>
        <Checkbox className={styles.checkbox} checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
        <label className={styles.checkboxLabel}>All day</label>
        <Dropdown options={repeatOptions} selected={repeat} onSelect={handleRepeatChange} />
      </div>
    </>
  );
};
