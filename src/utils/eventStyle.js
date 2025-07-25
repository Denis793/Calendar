export function getEventStyle(
  event,
  day,
  {
    START_HOUR,
    HOUR_HEIGHT_REM,
    EVENT_OPACITY,
    BORDER_DARKEN_AMOUNT,
    addOpacity,
    darkenColor,
    isSameDay,
    getEventWithCalendarColor,
  }
) {
  const eventDate = new Date(event.date);
  if (!isSameDay(eventDate, day)) return null;
  const eventWithColor = getEventWithCalendarColor(event);
  const [startHour, startMinute] = event.startTime.split(':').map(Number);
  const [endHour, endMinute] = event.endTime.split(':').map(Number);
  const startMinutes = (startHour - START_HOUR) * 60 + startMinute;
  const endMinutes = (endHour - START_HOUR) * 60 + endMinute;
  const duration = endMinutes - startMinutes;
  const baseZIndex = 1000;
  const maxDuration = 24 * 60;
  const zIndex = baseZIndex + Math.floor((maxDuration - duration) / 10);

  return {
    top: `${(startMinutes / 60) * HOUR_HEIGHT_REM}rem`,
    height: `${(duration / 60) * HOUR_HEIGHT_REM}rem`,
    backgroundColor: addOpacity(eventWithColor.color, EVENT_OPACITY),
    borderLeftColor: darkenColor(eventWithColor.color, BORDER_DARKEN_AMOUNT),
    zIndex: zIndex,
  };
}
