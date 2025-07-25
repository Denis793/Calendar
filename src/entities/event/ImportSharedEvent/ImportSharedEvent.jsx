import React, { useState, useMemo } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icons/Icons';
import { useCalendarStore } from '@/entities/calendar/calendarStore';
import { useEventStore } from '@/entities/event/eventStore';
import { useSharedEvent } from '@/utils/sharedEventUtils';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { format } from 'date-fns';
import styles from './ImportSharedEvent.module.scss';

const { FORMAT_DATE } = CALENDAR_CONSTANTS;

export const ImportSharedEvent = ({ isOpen, onClose, sharedEvent }) => {
  const { calendars, activeCalendarId } = useCalendarStore();
  const { events } = useEventStore();
  const { importSharedEvent } = useSharedEvent();
  const [isImporting, setIsImporting] = useState(false);

  const activeCalendar = calendars.find((cal) => cal.id === activeCalendarId) || calendars[0];

  const conflictingEvents = useMemo(() => {
    if (!sharedEvent || !activeCalendar) return [];

    const importDate = sharedEvent.date;
    const importStart = sharedEvent.startTime;
    const importEnd = sharedEvent.endTime;

    return events.filter((event) => {
      if (event.calendarId !== activeCalendar.id) return false;
      if (event.date !== importDate) return false;

      return (
        (importStart >= event.startTime && importStart < event.endTime) ||
        (importEnd > event.startTime && importEnd <= event.endTime) ||
        (importStart <= event.startTime && importEnd >= event.endTime)
      );
    });
  }, [sharedEvent, activeCalendar, events]);

  if (!isOpen || !sharedEvent) {
    return null;
  }

  const clearUrlParams = () => {
    const url = new URL(window.location);
    url.searchParams.delete('share');
    url.searchParams.delete('s');
    window.history.replaceState({}, document.title, url.toString());
  };

  const handleImport = async () => {
    setIsImporting(true);

    const success = importSharedEvent(sharedEvent, activeCalendar?.id);

    if (success) {
      clearUrlParams();
      onClose();
    }

    setIsImporting(false);
  };

  const handleDecline = () => {
    clearUrlParams();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleDecline} title="Import Shared Event" size="medium">
      <div className={styles.importContainer}>
        <div className={styles.eventPreview}>
          <h3 className={styles.eventTitle}>{sharedEvent.title}</h3>
          <p className={styles.eventDetails}>
            {format(new Date(sharedEvent.date), FORMAT_DATE)} • {sharedEvent.startTime} - {sharedEvent.endTime}
          </p>
          {sharedEvent.description && <p className={styles.eventDescription}>{sharedEvent.description}</p>}
        </div>

        {conflictingEvents.length > 0 && (
          <div className={styles.conflictWarning}>
            <Icon name="warning" className="icon" />
            <div className={styles.warningContent}>
              <p className={styles.warningTitle}>Time Conflict Detected</p>
              <p className={styles.warningText}>
                This event overlaps with {conflictingEvents.length} existing event
                {conflictingEvents.length > 1 ? 's' : ''}:
              </p>
              <ul className={styles.conflictList}>
                {conflictingEvents.map((event) => (
                  <li key={event.id} className={styles.conflictItem}>
                    <strong>{event.title}</strong> ({event.startTime} - {event.endTime})
                  </li>
                ))}
              </ul>
              <p className={styles.warningNote}>
                The imported event will be overlaid. Smaller events will appear in front.
              </p>
            </div>
          </div>
        )}

        <div className={styles.calendarSelection}>
          <label className={styles.label}>Import to calendar:</label>
          <div className={styles.calendarInfo}>
            <span className={styles.calendarName}>{activeCalendar?.name || 'Default Calendar'}</span>
            <span className={styles.calendarColor} style={{ backgroundColor: activeCalendar?.color }}></span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleDecline} disabled={isImporting}>
            Decline
          </Button>
          <Button type="button" variant="primary" onClick={handleImport} disabled={isImporting}>
            {isImporting ? 'Importing...' : 'Import Event'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
