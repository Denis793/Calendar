import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { apiService } from '@/shared/api/apiService';

export const useEventStore = create(
  persist(
    (set, get) => ({
      events: [],
      loading: false,
      error: null,

      fetchEvents: async (filters = {}) => {
        console.log('EventStore: Fetching events from server...');
        set({ loading: true, error: null });
        try {
          const events = await apiService.getEvents(filters);
          console.log('EventStore: Received events from server:', events);
          set({ events, loading: false });
        } catch (error) {
          console.error('Error fetching events:', error);
          set({ error: error.message, loading: false });
        }
      },

      syncEvent: async (event) => {
        try {
          if (!apiService.getSyncEnabled()) {
            console.log('Sync disabled, working offline');
            return event;
          }

          const serverEvent = await apiService.createEvent(event);
          return serverEvent;
        } catch (error) {
          console.error('Error syncing event:', error);
          return event;
        }
      },

      addEvent: async (eventData) => {
        const newEvent = {
          id: uuidv4(),
          calendarId: eventData.calendarId || 'default',
          ...eventData,
        };

        try {
          set((state) => ({
            events: [...state.events, newEvent],
          }));

          const syncedEvent = await get().syncEvent(newEvent);
          if (syncedEvent && syncedEvent.id === newEvent.id) {
            set((state) => ({
              events: state.events.map((event) => (event.id === newEvent.id ? syncedEvent : event)),
            }));
            return syncedEvent;
          }

          return newEvent;
        } catch {
          console.log('Working in offline mode, event saved locally');
          return newEvent;
        }
      },

      updateEvent: async (id, updatedData) => {
        console.log('EventStore: Updating event', id, 'with data:', updatedData);
        try {
          set((state) => ({
            events: state.events.map((event) => (event.id === id ? { ...event, ...updatedData } : event)),
          }));

          const updatedEvent = await apiService.updateEvent(id, updatedData);
          console.log('EventStore: Received updated event from server:', updatedEvent);

          set((state) => ({
            events: state.events.map((event) => (event.id === id ? updatedEvent : event)),
          }));
        } catch (error) {
          console.error('Error updating event:', error);
          get().fetchEvents();
        }
      },

      removeEvent: async (id) => {
        console.log('EventStore: Removing event', id);
        try {
          set((state) => ({
            events: state.events.filter((event) => event.id !== id),
          }));
          await apiService.deleteEvent(id);
          console.log('EventStore: Event successfully deleted from server');
        } catch (error) {
          console.error('Error removing event:', error);
          get().fetchEvents();
        }
      },

      duplicateEventToCalendar: async (eventId, newCalendarId) => {
        try {
          const { events } = get();
          const originalEvent = events.find((event) => event.id === eventId);

          if (!originalEvent) {
            console.warn(`Event with id "${eventId}" not found`);
            return null;
          }

          const newId = uuidv4();
          const duplicatedEvent = {
            ...originalEvent,
            id: newId,
            calendarId: newCalendarId,
            title: `${originalEvent.title} (Copy)`,
          };

          set((state) => ({
            events: [...state.events, duplicatedEvent],
          }));

          const syncedEvent = await apiService.duplicateEvent(eventId, newId, newCalendarId);
          set((state) => ({
            events: state.events.map((event) => (event.id === newId ? syncedEvent : event)),
          }));

          return syncedEvent;
        } catch (error) {
          console.error('Error duplicating event:', error);
          get().fetchEvents();
          return null;
        }
      },

      moveEventToCalendar: async (eventId, newCalendarId) => {
        console.log('EventStore: Moving event', eventId, 'to calendar', newCalendarId);
        try {
          set((state) => ({
            events: state.events.map((event) =>
              event.id === eventId ? { ...event, calendarId: newCalendarId } : event
            ),
          }));

          await apiService.moveEvent(eventId, newCalendarId);
          console.log('EventStore: Event successfully moved on server');
        } catch (error) {
          console.error('Error moving event:', error);
          get().fetchEvents();
        }
      },

      getEventsByCalendar: (calendarId) => {
        const { events } = get();
        return events.filter((event) => event.calendarId === calendarId);
      },
    }),
    {
      name: 'event-store',
      version: 1,
    }
  )
);
