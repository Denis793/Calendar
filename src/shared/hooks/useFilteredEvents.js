import { useEventStore } from '@/entities/event/eventStore';
import { useMemo } from 'react';
export const useFilteredEvents = (date, calendarIds) => {
  const allEvents = useEventStore((state) => state.events);

  return useMemo(
    () => allEvents.filter((event) => event.date === date && calendarIds.includes(event.calendarId)),
    [allEvents, date, calendarIds]
  );
};
