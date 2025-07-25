import { formatDateForAPI } from './dateUtils';

export function handleDropEvent({
  e,
  day,
  dayIndex,
  draggedEvent,
  cellHeightPx,
  workingHours,
  daySlotRefs,
  START_HOUR,
  INTERVAL_MINUTES,
  updateEvent,
  setDraggedEvent,
  setDragPosition,
}) {
  e.preventDefault();
  if (!draggedEvent || cellHeightPx === 0) return;

  const daySlotRef = daySlotRefs.current[dayIndex];
  if (!daySlotRef) return;
  const rect = daySlotRef.getBoundingClientRect();
  let offsetY = e.clientY - rect.top;
  const maxHeight = cellHeightPx * workingHours.length;
  if (offsetY < 0) offsetY = 0;
  if (offsetY > maxHeight) offsetY = maxHeight;
  const intervalsPerHour = 60 / INTERVAL_MINUTES;
  const pixelsPerInterval = cellHeightPx / intervalsPerHour;
  const absoluteIntervalIndex = Math.floor(offsetY / pixelsPerInterval);

  const newStartOffsetMin = absoluteIntervalIndex * INTERVAL_MINUTES;
  const [startH, startM] = draggedEvent.startTime.split(':').map(Number);
  const [endH, endM] = draggedEvent.endTime.split(':').map(Number);
  const duration = endH * 60 + endM - (startH * 60 + startM);

  const newStartTotal = START_HOUR * 60 + newStartOffsetMin;
  const newEndTotal = newStartTotal + duration;

  const newStartHour = Math.floor(newStartTotal / 60);
  const newStartMinute = newStartTotal % 60;
  const newEndHour = Math.floor(newEndTotal / 60);
  const newEndMinute = newEndTotal % 60;

  const formattedDate = formatDateForAPI(day);
  console.log('HandleDrop: Original day:', day, 'Formatted date:', formattedDate);

  updateEvent(draggedEvent.id, {
    date: formattedDate,
    startTime: `${String(newStartHour).padStart(2, '0')}:${String(newStartMinute).padStart(2, '0')}`,
    endTime: `${String(newEndHour).padStart(2, '0')}:${String(newEndMinute).padStart(2, '0')}`,
  });

  setDraggedEvent(null);
  setDragPosition(null);
}
