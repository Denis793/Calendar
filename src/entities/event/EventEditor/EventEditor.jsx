import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { ColorPicker } from '@/shared/ui/ColorPicker';
import { DatePicker } from '@/shared/ui/DatePicker';
import { SelectMenu } from '@/shared/ui/SelectMenu';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icons';
import styles from './EventEditor.module.scss';
import { useEventStore } from '@/entities/event/eventStore';

const { START_HOUR, END_HOUR, INTERVAL_MINUTES, FORMAT_DATE } = CALENDAR_CONSTANTS;
const generateTimeOptions = () => {
  const options = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    for (let m = 0; m < 60; m += INTERVAL_MINUTES) {
      if (h === END_HOUR && m > 0) continue;
      const key = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const label = key;
      options.push({ key, label, value: key });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export const EventEditor = ({ initialData, onSubmit, onCancel }) => {
  const { events } = useEventStore();

  const [formData, setFormData] = useState({
    title: initialData.title,
    date: initialData.date ? new Date(initialData.date) : new Date(),
    allDay: initialData.allDay,
    weekly: initialData.weekly,
    color: initialData.color,
    description: initialData.description,
    startTime: initialData.startTime,
    endTime: initialData.endTime,
    id: initialData.id,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const busySlots = useMemo(() => {
    const currentDate = format(formData.date ? new Date(formData.date) : new Date(), FORMAT_DATE);
    return events
      .filter((ev) => ev.date === currentDate && ev.id !== formData.id)
      .flatMap((ev) => {
        const slots = [];
        const [startH, startM] = ev.startTime.split(':').map(Number);
        const [endH, endM] = ev.endTime.split(':').map(Number);
        let start = startH * 60 + startM;
        const end = endH * 60 + endM;
        while (start < end) {
          const h = Math.floor(start / 60)
            .toString()
            .padStart(2, '0');
          const m = (start % 60).toString().padStart(2, '0');
          slots.push(`${h}:${m}`);
          start += INTERVAL_MINUTES;
        }
        return slots;
      });
  }, [events, formData.date, formData.id]);

  const timeOptionsWithBusy = timeOptions.map((opt) => ({
    ...opt,
    isBusy: busySlots.includes(opt.value),
  }));

  const filteredEndOptions = timeOptionsWithBusy.filter((opt) => opt.value > formData.startTime);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
    setShowDatePicker(false);
  };

  const handleStartTimeChange = (selectedTime) => {
    setFormData((prev) => {
      let newEndTime = prev.endTime;
      if (!newEndTime || selectedTime >= prev.endTime) {
        const idx = timeOptions.findIndex((opt) => opt.value === selectedTime);
        newEndTime = timeOptions[idx + 1]?.value || selectedTime;
      }
      return { ...prev, startTime: selectedTime, endTime: newEndTime };
    });
  };

  const handleEndTimeChange = (selectedTime) => {
    setFormData((prev) => ({
      ...prev,
      endTime: selectedTime,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }));
    setShowColorPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      date: format(formData.date, FORMAT_DATE),
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.eventForm}>
      <div className={styles.formGroupWithIcon}>
        <Icon className="icon" name="title" />
        <Input name="title" placeholder="Event title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className={styles.formGroupWithIcon}>
        <Icon className="icon" name="time" />
        <div className={styles.dateTimePickers}>
          <Button
            className={styles.dateDisplayButton}
            variant="secondary"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {format(formData.date, 'PPPP')}
          </Button>
          {showDatePicker && <DatePicker selectedDate={formData.date} onDateChange={handleDateChange} />}

          <div className={styles.timePickers}>
            <SelectMenu
              label="Beginning"
              options={timeOptionsWithBusy.map((opt) => ({
                ...opt,
                label: <span className={opt.isBusy ? styles.busyOption : undefined}>{opt.label}</span>,
              }))}
              value={formData.startTime}
              onChange={handleStartTimeChange}
              isOptionDisabled={(opt) => opt.isBusy}
            />
            <SelectMenu
              label="End"
              options={filteredEndOptions.map((opt) => ({
                ...opt,
                label: <span className={opt.isBusy ? styles.busyOption : undefined}>{opt.label}</span>,
              }))}
              value={formData.endTime}
              onChange={handleEndTimeChange}
              isOptionDisabled={(opt) => opt.isBusy}
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroupWithIcon}>
        <Icon className="icon" name="calendar" />
        <div className={styles.colorPickerDisplay}>
          <Button
            className={styles.currentColorIndicator}
            variant="secondary"
            style={{ backgroundColor: formData.color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && <ColorPicker selectedColor={formData.color} onColorSelect={handleColorSelect} />}
        </div>
      </div>

      <div className={styles.formGroupWithIcon}>
        <Icon className="icon" name="description" />
        <Input name="description" placeholder="Add description" value={formData.description} onChange={handleChange} />
      </div>

      <div className={styles.formActions}>
        <Button className={styles.cancelButton} variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button className={styles.saveButton} type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
};
