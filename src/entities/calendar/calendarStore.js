import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { defaultColors } from '@/shared/config/defaultColors';
import { apiService } from '@/shared/api/apiService';

export const useCalendarStore = create(
  persist(
    (set, get) => ({
      calendars: [
        {
          id: 'default',
          name: 'Default Calendar',
          color: defaultColors[0].value,
          visible: false,
          isDefault: true,
        },
      ],
      activeCalendarId: 'default',
      loading: false,
      error: null,

      fetchCalendars: async () => {
        console.log('CalendarStore: Fetching calendars from server...');
        set({ loading: true, error: null });
        try {
          const calendars = await apiService.getCalendars();
          console.log('CalendarStore: Received calendars from server:', calendars);

          const hasDefaultCalendar = calendars.some((cal) => cal.isDefault);

          if (!hasDefaultCalendar) {
            console.log('No default calendar found, creating one...');
            try {
              const defaultCalendar = await apiService.createDefaultCalendar();
              calendars.unshift(defaultCalendar);
              console.log('Default calendar created:', defaultCalendar);
            } catch (error) {
              console.error('Failed to create default calendar, using local one:', error);

              calendars.unshift({
                id: 'default-local',
                name: 'Default Calendar',
                color: '#3B82F6',
                visible: false,
                isDefault: true,
                description: 'Default Calendar',
                isOwned: true,
                settings: {},
                sharedWith: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
          }

          set({
            calendars: calendars.length > 0 ? calendars : get().calendars,
            loading: false,
            activeCalendarId:
              calendars.length > 0
                ? calendars.find((cal) => cal.isDefault)?.id || calendars[0].id
                : get().activeCalendarId,
          });
        } catch (error) {
          console.error('Error fetching calendars:', error);
          set({ error: error.message, loading: false });
        }
      },

      syncCalendar: async (calendar) => {
        try {
          if (calendar.isDefault) {
            return calendar;
          }

          const serverCalendar = await apiService.createCalendar(calendar);
          return serverCalendar;
        } catch (error) {
          console.error('Error syncing calendar:', error);
          throw error;
        }
      },

      createDefaultCalendar: async () => {
        try {
          const defaultCalendar = await apiService.createDefaultCalendar();
          console.log('Created default calendar:', defaultCalendar);

          set((state) => {
            const existingDefault = state.calendars.find((cal) => cal.isDefault);
            if (existingDefault) {
              return {
                calendars: state.calendars.map((cal) => (cal.isDefault ? defaultCalendar : cal)),
              };
            } else {
              return {
                calendars: [...state.calendars, defaultCalendar],
                activeCalendarId: defaultCalendar.id,
              };
            }
          });

          return defaultCalendar;
        } catch (error) {
          console.error('Error creating default calendar:', error);
          throw error;
        }
      },

      addCalendar: async (calendarData) => {
        const newCalendar = {
          id: uuidv4(),
          visible: false,
          isDefault: false,
          ...calendarData,
        };

        try {
          set((state) => ({
            calendars: [...state.calendars, newCalendar],
            activeCalendarId: newCalendar.id,
          }));

          const syncedCalendar = await get().syncCalendar(newCalendar);

          set((state) => ({
            calendars: state.calendars.map((cal) => (cal.id === newCalendar.id ? syncedCalendar : cal)),
          }));

          return syncedCalendar;
        } catch (error) {

          console.error('Failed to sync calendar with server:', error);
          return newCalendar;
        }
      },

      updateCalendar: async (id, updatedData) => {
        console.log('CalendarStore: Updating calendar', id, 'with data:', updatedData);
        try {
          set((state) => ({
            calendars: state.calendars.map((calendar) =>
              calendar.id === id ? { ...calendar, ...updatedData } : calendar
            ),
          }));

          const calendar = get().calendars.find((cal) => cal.id === id);
          if (calendar && !calendar.isDefault) {
            const updatedCalendar = await apiService.updateCalendar(id, updatedData);
            console.log('CalendarStore: Received updated calendar from server:', updatedCalendar);

            set((state) => ({
              calendars: state.calendars.map((cal) => (cal.id === id ? updatedCalendar : cal)),
            }));
          }
        } catch (error) {
          console.error('Error updating calendar:', error);
          get().fetchCalendars();
        }
      },

      removeCalendar: async (id) => {
        console.log('CalendarStore: Removing calendar', id);
        try {
          const calendarToRemove = get().calendars.find((calendar) => calendar.id === id);
          if (calendarToRemove && calendarToRemove.isDefault) {
            console.warn('Cannot remove default calendar');
            return;
          }

          set((state) => {
            const remainingCalendars = state.calendars.filter((calendar) => calendar.id !== id);

            let newActiveCalendarId = state.activeCalendarId;
            if (state.activeCalendarId === id) {
              const firstRemainingCalendar = remainingCalendars[0];
              newActiveCalendarId = firstRemainingCalendar ? firstRemainingCalendar.id : null;
            }

            return {
              calendars: remainingCalendars,
              activeCalendarId: newActiveCalendarId,
            };
          });

          if (calendarToRemove && !calendarToRemove.isDefault) {
            await apiService.deleteCalendar(id);
            console.log('CalendarStore: Calendar successfully deleted from server');
          }
        } catch (error) {
          console.error('Error removing calendar:', error);
          get().fetchCalendars();
        }
      },

      canRemoveCalendar: (id) => {
        const { calendars } = get();
        const calendar = calendars.find((cal) => cal.id === id);
        return calendar && !calendar.isDefault;
      },

      toggleCalendarVisibility: async (id) => {
        try {
          set((state) => ({
            calendars: state.calendars.map((calendar) =>
              calendar.id === id ? { ...calendar, visible: !calendar.visible } : calendar
            ),
          }));

          const calendar = get().calendars.find((cal) => cal.id === id);
          if (calendar && !calendar.isDefault) {
            await apiService.toggleCalendarVisibility(id);
          }
        } catch (error) {
          console.error('Error toggling calendar visibility:', error);
          get().fetchCalendars();
        }
      },

      setActiveCalendar: (id) =>
        set(() => ({
          activeCalendarId: id,
        })),

      getActiveCalendar: () => {
        const { calendars, activeCalendarId } = get();
        if (!activeCalendarId) return null;
        return calendars.find((cal) => cal.id === activeCalendarId) || null;
      },

      getVisibleCalendars: () => {
        const { calendars } = get();
        return calendars.filter((cal) => cal.visible);
      },

      getCalendarById: (id) => {
        const { calendars } = get();
        return calendars.find((cal) => cal.id === id);
      },
    }),
    {
      name: 'calendar-store',
      version: 1,
    }
  )
);
