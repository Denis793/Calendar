import { useState, useMemo, useCallback } from 'react';
import { format, isBefore, startOfDay, isSameDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useEventStore } from '@/entities/event/eventStore';
import { useCalendarStore } from '@/entities/calendar/calendarStore';
import { useToast } from '@/shared/ui/Toast/ToastContext';
import { useEventTimeLogic } from '@/shared/hooks/useEventTimeLogic';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { canCreateEventInCalendar } from '@/utils/calendarUtils';
import { getRepeatDates } from '@/utils/repeatUtils';
import { showEventToast } from '@/utils/eventHandlers';

const { FORMAT_DATE } = CALENDAR_CONSTANTS;

export function useEventFormLogic(props) {
  const { event, onClose, defaultDate, defaultTime, defaultCalendarId, activeCalendarId } = props;
  const addEvent = useEventStore((state) => state.addEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const removeEvent = useEventStore((state) => state.removeEvent);
  const { events } = useEventStore();
  const { calendars } = useCalendarStore();
  const { showToast } = useToast();

  const [isColorPickerModalOpen, setIsColorPickerModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);

  const repeatOptions = [
    { label: 'Do not repeat', value: 'none' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];
  const calendarOptions = calendars.map((calendar) => ({
    label: calendar.name,
    value: calendar.id,
    color: calendar.color,
  }));

  const initialValues = {
    title: event?.title || '',
    date: event?.date ? new Date(event.date) : defaultDate || new Date(),
    startTime: event?.startTime || defaultTime || '09:00',
    endTime:
      event?.endTime ||
      (defaultTime
        ? (() => {
            const [hours, minutes] = (defaultTime || '09:00').split(':').map(Number);
            const endHours = hours + 1;
            return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          })()
        : '10:00'),
    allDay: event?.allDay || false,
    repeat: event?.repeat || 'none',
    calendarId: event?.calendarId || defaultCalendarId || activeCalendarId || (calendarOptions[0]?.value ?? ''),
    description: event?.description || '',
    color: event?.color,
  };

  const getDayEvents = useCallback(
    (date, calendarId) =>
      events.filter(
        (ev) => ev.calendarId === calendarId && isSameDay(new Date(ev.date), date) && (!event || ev.id !== event.id)
      ),
    [events, event]
  );

  const dayEvents = useMemo(
    () => getDayEvents(initialValues.date, initialValues.calendarId),
    [getDayEvents, initialValues.date, initialValues.calendarId]
  );

  const eventTimeLogic = useEventTimeLogic(
    initialValues.startTime,
    initialValues.endTime,
    () => {
      // This will be used to update endTime when startTime changes
    },
    dayEvents
  );

  const getOccupiedDates = (calendarId) => {
    return events
      .filter((event) => event.calendarId === calendarId)
      .map((event, index) => ({
        ...event,
        key: `occupied-date-${event.id || index}`,
        date: new Date(event.date),
      }));
  };

  const findRelatedRepeatEvents = (baseEvent) => {
    if (!baseEvent) return [];

    return events.filter((ev) => {
      if (ev.id === baseEvent.id) return false;

      return (
        ev.title === baseEvent.title &&
        ev.startTime === baseEvent.startTime &&
        ev.endTime === baseEvent.endTime &&
        ev.calendarId === baseEvent.calendarId &&
        ev.description === baseEvent.description &&
        ev.color === baseEvent.color &&
        ev.allDay === baseEvent.allDay &&
        ev.repeat === baseEvent.repeat
      );
    });
  };

  const removeRelatedRepeatEvents = (baseEvent) => {
    const relatedEvents = findRelatedRepeatEvents(baseEvent);
    relatedEvents.forEach((ev) => {
      removeEvent(ev.id);
    });
    return relatedEvents.length;
  };

  const handleSubmit = async (formData, { setSubmitting }) => {
    if (!event) {
      if (!canCreateEventInCalendar(calendars, formData.calendarId)) {
        showEventToast('creationError', showToast, { calendars, calendarId: formData.calendarId });
        setSubmitting(false);
        return;
      }
    }

    const eventData = {
      title: formData.title.trim(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      allDay: formData.allDay,
      repeat: formData.repeat,
      calendarId: formData.calendarId,
      description: formData.description,
      color: formData.color,
    };

    try {
      if (formData.repeat && formData.repeat !== 'none') {
        const repeatDates = getRepeatDates(formData.date, formData.repeat, 10);

        if (event) {
          removeRelatedRepeatEvents(event);
          removeEvent(event.id);
        }

        repeatDates.forEach((d) => {
          addEvent({
            ...eventData,
            id: uuidv4(),
            date: format(d, FORMAT_DATE),
          });
        });
        showEventToast('recurringCreated', showToast, { title: formData.title.trim() });
      } else {
        if (event) {
          if (event.repeat && event.repeat !== 'none') {
            removeRelatedRepeatEvents(event);
          }
          updateEvent(event.id, {
            ...eventData,
            id: event.id,
            date: format(formData.date, FORMAT_DATE),
          });
          showEventToast('updated', showToast, { title: formData.title.trim() });
        } else {
          addEvent({
            ...eventData,
            id: uuidv4(),
            date: format(formData.date, FORMAT_DATE),
          });
          showEventToast('created', showToast, { title: formData.title.trim() });
        }
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      showEventToast('saveError', showToast);
    }
    setSubmitting(false);
  };

  const getDetailsSectionProps = ({ values, errors, touched, setFieldValue }) => ({
    title: values.title,
    setTitle: (v) => setFieldValue('title', v),
    error: touched.title && errors.title,
  });

  const getScheduleSectionProps = ({ values, errors, touched, setFieldValue }) => ({
    date: values.date,
    setIsDatePickerModalOpen,
    startTime: values.startTime,
    setStartTime: (v) => setFieldValue('startTime', v),
    endTime: values.endTime,
    setEndTime: (v) => setFieldValue('endTime', v),
    allDay: values.allDay,
    setAllDay: (v) => setFieldValue('allDay', v),
    repeat: values.repeat,
    setRepeat: (v) => setFieldValue('repeat', v),
    allTimeOptions: eventTimeLogic.allTimeOptions,
    endTimeOptions: eventTimeLogic.endTimeOptions,
    repeatOptions,
    error:
      (touched.date && errors.date) || (touched.startTime && errors.startTime) || (touched.endTime && errors.endTime),
  });

  const getCalendarColorSectionProps = ({ values, errors, touched, setFieldValue }) => ({
    calendar: values.calendarId,
    setCalendar: (v) => setFieldValue('calendarId', v),
    calendarOptions,
    eventColor: values.color,
    setIsColorPickerModalOpen,
    error: touched.calendarId && errors.calendarId,
  });

  const getDescriptionSectionProps = ({ values, setFieldValue }) => ({
    description: values.description,
    setDescription: (v) => setFieldValue('description', v),
  });

  const handleColorChange = (setFieldValue) => (color) => {
    setFieldValue('color', color);
    setIsColorPickerModalOpen(false);
  };

  const handleDateSelect = (setFieldValue) => (selectedDate) => {
    const today = startOfDay(new Date());
    const selectedDay = startOfDay(selectedDate);
    if (isBefore(selectedDay, today)) {
      showEventToast('pastDate', showToast);
      return;
    }
    setFieldValue('date', selectedDate);
    setIsDatePickerModalOpen(false);
  };

  const closeColorPickerModal = () => setIsColorPickerModalOpen(false);
  const closeDatePickerModal = () => setIsDatePickerModalOpen(false);

  return {
    initialValues,
    handleSubmit,
    isColorPickerModalOpen,
    isDatePickerModalOpen,
    closeColorPickerModal,
    closeDatePickerModal,
    handleColorChange,
    handleDateSelect,
    getDetailsSectionProps,
    getScheduleSectionProps,
    getCalendarColorSectionProps,
    getDescriptionSectionProps,
    getOccupiedDates: (calendarId) => getOccupiedDates(calendarId).map((item) => item.date),
  };
}
