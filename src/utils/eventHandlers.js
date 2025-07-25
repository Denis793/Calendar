import { CALENDAR_CONSTANTS } from '@/shared/config/constants';

const { TOAST_DURATION } = CALENDAR_CONSTANTS;

export function handleEditEvent(
  event,
  getActiveCalendar,
  showToast,
  setEventToEdit,
  setShowEditModal,
  setShowEventModal
) {
  const activeCalendar = getActiveCalendar();
  if (activeCalendar && activeCalendar.visible) {
    showToast({
      message: 'Cannot edit events in completed calendar. Mark it as incomplete first.',
      duration: TOAST_DURATION,
    });
    return;
  }
  setEventToEdit(event);
  setShowEditModal(true);
  setShowEventModal(false);
}

export function handleDeleteEvent(eventId, events, removeEvent, showToast, setShowEventModal, TOAST_DURATION) {
  const event = events.find((ev) => ev.id === eventId);
  removeEvent(eventId);
  showToast({
    message: `Event "${event?.title}" has been deleted`,
    duration: TOAST_DURATION,
  });
  setShowEventModal(false);
}

export function handleDaySlotClick(
  day,
  hour,
  e,
  wasResizingRef,
  styles,
  getActiveCalendar,
  showToast,
  isPastDate,
  setSelectedDay,
  setSelectedHour,
  setShowCreateModal,
  TOAST_DURATION
) {
  if (wasResizingRef.current) {
    wasResizingRef.current = false;
    return;
  }
  if (e.target.closest(`.${styles.event}`)) return;
  const activeCalendar = getActiveCalendar();
  if (!activeCalendar) {
    showToast({
      message: 'Please select an active calendar first',
      duration: TOAST_DURATION,
    });
    return;
  }
  if (activeCalendar.visible) {
    showToast({
      message: 'Cannot create events in completed calendar. Mark it as incomplete first.',
      duration: TOAST_DURATION,
    });
    return;
  }
  if (isPastDate(day)) {
    showToast({
      message: 'Cannot create events in the past',
      duration: TOAST_DURATION,
    });
    return;
  }
  setSelectedDay(day);
  setSelectedHour(hour);

  if (typeof setShowCreateModal === 'function') {
    setShowCreateModal(true);
  }
}

export function showEventToast(type, showToast, options = {}) {
  let calendar;
  const TOAST_DURATION = options.TOAST_DURATION;
  switch (type) {
    case 'created':
      showToast({ message: `Event "${options.title}" has been created`, duration: TOAST_DURATION });
      break;
    case 'updated':
      showToast({ message: `Event "${options.title}" has been updated`, duration: TOAST_DURATION });
      break;
    case 'recurringCreated':
      showToast({ message: `Recurring events "${options.title}" have been created`, duration: TOAST_DURATION });
      break;
    case 'creationError':
      calendar = options.calendars?.find((c) => c.id === options.calendarId);
      showToast({
        message: calendar
          ? `Cannot create event in calendar "${calendar.name}"`
          : 'Cannot create event in selected calendar',
        duration: TOAST_DURATION,
      });
      break;
    case 'saveError':
      showToast({ message: 'Failed to save event. Please try again.', duration: TOAST_DURATION });
      break;
    case 'pastDate':
      showToast({ message: 'Cannot select past dates for events', duration: TOAST_DURATION });
      break;
    case 'timeConflict':
      showToast({
        message: options.conflictEvent
          ? `This time slot conflicts with "${options.conflictEvent.title}" (${options.conflictEvent.startTime} - ${options.conflictEvent.endTime}) in the same calendar.`
          : 'Time conflict detected.',
        duration: TOAST_DURATION,
      });
      break;
    case 'shared':
      showToast({ message: 'Event link copied to clipboard!', duration: TOAST_DURATION });
      break;
    case 'shareError':
      showToast({ message: 'Failed to copy link. Please try again.', duration: TOAST_DURATION });
      break;
    case 'invalidSharedData':
      showToast({ message: 'Invalid shared event data', duration: TOAST_DURATION });
      break;
    case 'eventImported':
      showToast({ message: `Event "${options.title}" has been imported to your calendar`, duration: TOAST_DURATION });
      break;
    case 'importError':
      showToast({ message: 'Failed to import event. Please try again.', duration: TOAST_DURATION });
      break;
    default:
      break;
  }
}
