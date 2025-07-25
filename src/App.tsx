import { useEffect, useState } from 'react';
import { useDateStore } from '@/entities/date/dateStore';
import { useCalendarStore } from '@/entities/calendar/calendarStore';
import { useEventStore } from '@/entities/event/eventStore';
import { Header } from '@/features/layout/Header';
import { Sidebar } from '@/features/layout/Sidebar';
import { DayView } from '@/features/dayView/DayView';
import { WeekView } from '@/features/weekView/WeekView';
import { ImportSharedEvent } from '@/entities/event/ImportSharedEvent';
import { checkForSharedEvent } from '@/utils/sharedEventUtils';
import { cleanupExpiredLinks } from '@/utils/secureShareUtils';
import ToastManager from '@/shared/ui/Toast/ToastManager';
import { ToastProvider } from '@/shared/ui/Toast/ToastContext';
import type { Event } from '@/types';
import './styles/main.scss';

interface SharedEvent extends Omit<Event, 'weekly'> {
  repeat?: string;
}

function App() {
  const { viewMode, currentDate } = useDateStore();
  const { fetchCalendars } = useCalendarStore();
  const { fetchEvents } = useEventStore();
  const [sharedEvent, setSharedEvent] = useState<SharedEvent | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchCalendars(), fetchEvents()]);
        console.log('Data synchronized with server');
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
    cleanupExpiredLinks();

    const shared = checkForSharedEvent();
    if (shared) {
      setSharedEvent(shared);
      setShowImportModal(true);
    }
  }, [fetchCalendars, fetchEvents]);

  const handleCloseImportModal = () => {
    setShowImportModal(false);
    setSharedEvent(null);
  };

  return (
    <>
      <ToastProvider>
        <div className="appLayout">
          <Header />
          <main className="main">
            <div className="container">
              <div className="mainContent">
                <Sidebar />
                {viewMode === 'day' && <DayView date={currentDate} />}
                {viewMode === 'week' && <WeekView />}
              </div>
            </div>
          </main>
          <ToastManager />
          <ImportSharedEvent isOpen={showImportModal} onClose={handleCloseImportModal} sharedEvent={sharedEvent} />
        </div>
      </ToastProvider>
    </>
  );
}

export default App;
