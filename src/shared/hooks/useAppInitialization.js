import { useEffect } from 'react';
import { useCalendarStore } from '@/entities/calendar/calendarStore';
import { useEventStore } from '@/entities/event/eventStore';

export const useAppInitialization = () => {
  const fetchCalendars = useCalendarStore((state) => state.fetchCalendars);
  const fetchEvents = useEventStore((state) => state.fetchEvents);

  const calendarsLoading = useCalendarStore((state) => state.loading);
  const eventsLoading = useEventStore((state) => state.loading);

  const calendarsError = useCalendarStore((state) => state.error);
  const eventsError = useEventStore((state) => state.error);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchCalendars();
        await fetchEvents();

        console.log('📅 App initialized successfully');
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      }
    };

    initializeApp();
  }, [fetchCalendars, fetchEvents]);

  return {
    loading: calendarsLoading || eventsLoading,
    error: calendarsError || eventsError,
  };
};
