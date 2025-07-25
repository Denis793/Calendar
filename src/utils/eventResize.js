export function getResizedEventTimes(event, absoluteIntervalIndex, direction, START_HOUR, INTERVAL_MINUTES) {
  const [startH, startM] = event.startTime.split(':').map(Number);
  const [endH, endM] = event.endTime.split(':').map(Number);
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  const newTotal = START_HOUR * 60 + absoluteIntervalIndex * INTERVAL_MINUTES;

  if (direction === 'top') {
    if (newTotal >= endTotal) return null;
    const newStartHour = Math.floor(newTotal / 60);
    const newStartMinute = newTotal % 60;
    return { startTime: `${String(newStartHour).padStart(2, '0')}:${String(newStartMinute).padStart(2, '0')}` };
  } else {
    if (newTotal <= startTotal) return null;
    const newEndHour = Math.floor(newTotal / 60);
    const newEndMinute = newTotal % 60;
    return { endTime: `${String(newEndHour).padStart(2, '0')}:${String(newEndMinute).padStart(2, '0')}` };
  }
}
