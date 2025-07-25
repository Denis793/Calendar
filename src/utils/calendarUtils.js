export const canCreateEventInCalendar = (calendars, activeCalendarId) => {
  const activeCalendar = calendars.find((cal) => cal.id === activeCalendarId);

  if (!activeCalendar) {
    return false;
  }

  const canCreate = activeCalendar && !activeCalendar.visible;
  return canCreate;
};

export const getEventCreationErrorMessage = (calendars, activeCalendarId) => {
  const activeCalendar = calendars.find((cal) => cal.id === activeCalendarId);

  if (!activeCalendar) {
    return 'No active calendar selected';
  }

  if (activeCalendar.visible) {
    return 'Cannot create events in completed calendar. Mark it as incomplete first by unchecking the checkbox.';
  }

  return null;
};
