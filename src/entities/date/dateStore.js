import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays } from 'date-fns';

export const useDateStore = create(
  persist(
    (set) => ({
      currentDate: new Date(),
      viewMode: 'week',

      goToPrev: () =>
        set((state) => {
          if (state.viewMode === 'day') {
            return { currentDate: addDays(state.currentDate, -1) };
          }
          return { currentDate: addDays(state.currentDate, -7) };
        }),

      goToNext: () =>
        set((state) => {
          if (state.viewMode === 'day') {
            return { currentDate: addDays(state.currentDate, 1) };
          }
          return { currentDate: addDays(state.currentDate, 7) };
        }),

      goToToday: () => set({ currentDate: new Date() }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setCurrentDate: (date) => set({ currentDate: date }),
    }),
    {
      name: 'calendar-date-store',
      partialize: (state) => ({
        currentDate: state.currentDate,
        viewMode: state.viewMode,
      }),
    }
  )
);
