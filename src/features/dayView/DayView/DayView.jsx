import React, { useMemo, useState, useRef, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { CurrentTimeMarker } from '@/widgets/CurrentTimeMarker';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast/ToastContext';
import { CalendarEvent } from '@/shared/ui/CalendarEvent';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';

import { useEventStore } from '@/entities/event/eventStore';
import { useCalendarStore } from '@/entities/calendar/calendarStore';

import { EventInfoModal } from '@/features/weekView/EventInfoModal';
import { EventFormModal } from '@/features/weekView/EventFormModal';
import { DragDropContext } from '@/features/dragDrop/DragDropContext';

import { getEventStyle } from '@/utils/eventStyle';
import { handleDropEvent } from '@/utils/handleDrop';
import { getResizedEventTimes } from '@/utils/eventResize';
import { darkenColor, addOpacity } from '@/utils/colorUtils';
import { handleEditEvent, handleDeleteEvent, handleDaySlotClick } from '@/utils/eventHandlers';

import styles from './DayView.module.scss';

const {
  TOAST_DURATION,
  HOUR_HEIGHT_REM,
  START_HOUR,
  END_HOUR,
  INTERVAL_MINUTES,
  EVENT_OPACITY,
  DEFAULT_EVENT_COLOR,
  BORDER_DARKEN_AMOUNT,
} = CALENDAR_CONSTANTS;

export const DayView = ({ date = new Date() }) => {
  const { events, removeEvent, updateEvent } = useEventStore();
  const { activeCalendarId, getActiveCalendar } = useCalendarStore();
  const { showToast } = useToast();

  const [eventToEdit, setEventToEdit] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [isEventResizing, setIsEventResizing] = useState(false);
  const wasResizingRef = useRef(false);
  const cellRef = useRef(null);

  useEffect(() => {
    if (cellRef.current) {
      const d = date instanceof Date ? date : new Date(date);
      cellRef.current.dataset.date = d.toISOString().split('T')[0];
    }
  }, [date]);

  const workingHours = useMemo(() => Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR), []);

  const dayEvents = useMemo(() => {
    if (!activeCalendarId) return [];
    return events
      .filter((event) => isSameDay(new Date(event.date), date) && event.calendarId === activeCalendarId)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, date, activeCalendarId]);

  const getEventWithCalendarColor = (event) => {
    const activeCalendar = getActiveCalendar();
    return {
      ...event,
      color: event.color || activeCalendar?.color || DEFAULT_EVENT_COLOR,
    };
  };

  const handleEventClick = (event, e) => {
    if (isEventResizing) return;
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const onEditEvent = (event) =>
    handleEditEvent(
      event,
      getActiveCalendar,
      showToast,
      setEventToEdit,
      setShowEditModal,
      setShowEventModal,
      TOAST_DURATION
    );

  const onDeleteEvent = (eventId) =>
    handleDeleteEvent(eventId, events, removeEvent, showToast, setShowEventModal, TOAST_DURATION);

  const handleResize = (event, intervalIndex, direction = 'bottom') => {
    const result = getResizedEventTimes(event, intervalIndex, direction, START_HOUR, INTERVAL_MINUTES);
    if (result) updateEvent(event.id, result);
  };

  const handleDrop = (e) => {
    handleDropEvent({
      e,
      day: date,
      dayIndex: 0,
      draggedEvent,
      cellHeightPx: cellRef.current?.getBoundingClientRect().height || 0,
      workingHours,
      daySlotRefs: { current: [cellRef.current] },
      START_HOUR,
      INTERVAL_MINUTES,
      updateEvent,
      setDraggedEvent,
      setDragPosition,
    });
  };

  return (
    <div className={styles.calendarGrid}>
      <div className={styles.calendarGridBody}>
        <div className={styles.calendarHourRow} style={{ height: `${HOUR_HEIGHT_REM}rem` }} />

        <DragDropContext
          draggedEvent={draggedEvent}
          setDraggedEvent={setDraggedEvent}
          dragPosition={dragPosition}
          setDragPosition={setDragPosition}
          cellHeightPx={cellRef.current?.getBoundingClientRect().height || 0}
          workingHours={{ length: workingHours.length, intervalMinutes: INTERVAL_MINUTES }}
          daySlotRefs={{ current: [cellRef.current] }}
          startHour={START_HOUR}
        >
          {(dragDropHandlers) => (
            <>
              {workingHours.map((hour, idx) => (
                <div
                  key={`hour-row-${hour}`}
                  className={styles.calendarHourRow}
                  style={{ height: `${HOUR_HEIGHT_REM}rem` }}
                >
                  <div className={styles.calendarTimeSlot}>
                    <span className={styles.calendarTimeLabel}>{String(hour).padStart(2, '0')}:00</span>
                  </div>
                  <div
                    ref={idx === 0 ? cellRef : undefined}
                    className={styles.calendarDaySlot}
                    onClick={(e) =>
                      handleDaySlotClick(
                        date,
                        hour,
                        e,
                        wasResizingRef,
                        styles,
                        getActiveCalendar,
                        showToast,
                        () => false,
                        () => setSelectedHour(hour),
                        () => setShowCreateModal(true),
                        TOAST_DURATION
                      )
                    }
                    onDragOver={(e) => dragDropHandlers.handleDragOver(e, date, 0)}
                    onDrop={(e) => {
                      dragDropHandlers.handleDrop(e, date, 0);
                      handleDrop(e);
                    }}
                  >
                    <div className={styles.calendarTimeContent}>{idx === 0 && <CurrentTimeMarker />}</div>
                  </div>
                </div>
              ))}

              <div className={styles.calendarEventsContainer}>
                {dayEvents.map((event) => {
                  const style = getEventStyle(event, date, {
                    START_HOUR,
                    HOUR_HEIGHT_REM,
                    EVENT_OPACITY,
                    BORDER_DARKEN_AMOUNT,
                    addOpacity,
                    darkenColor,
                    isSameDay,
                    getEventWithCalendarColor,
                  });
                  if (!style) return null;
                  style.top = `calc(${style.top} + ${HOUR_HEIGHT_REM}rem)`;

                  return (
                    <CalendarEvent
                      key={`event-${event.id}`}
                      event={event}
                      activeCalendar={getActiveCalendar()}
                      onClick={(e) => handleEventClick(event, e)}
                      style={style}
                      draggable
                      onDragStart={(e) => {
                        setDraggedEvent(event);
                        dragDropHandlers.handleDragStart(e, event);
                      }}
                      onDragEnd={dragDropHandlers.handleDragEnd}
                      onResizeStart={(eventObj, onResize, direction = 'bottom') => {
                        setIsEventResizing(true);
                        wasResizingRef.current = true;
                        dragDropHandlers.handleResizeStart(
                          eventObj,
                          (resizeDay, intervalIndex, dir) => {
                            handleResize(eventObj, intervalIndex, dir || direction);
                          },
                          direction
                        );
                      }}
                      onResizeEnd={() => {
                        setIsEventResizing(false);
                        wasResizingRef.current = false;
                        dragDropHandlers.handleResizeEnd();
                      }}
                      onResize={
                        dragDropHandlers && dragDropHandlers.resizeData
                          ? (resizeDay, intervalIndex, direction = 'bottom') => {
                              handleResize(event, intervalIndex, direction);
                            }
                          : undefined
                      }
                      title={`${event.title}\n${event.startTime} - ${event.endTime}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </DragDropContext>

        {dayEvents.length === 0 && (
          <div className={styles.calendarNoEvents}>
            <p>No events scheduled for this day</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create first event
            </Button>
          </div>
        )}
      </div>

      <EventInfoModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
        onEdit={onEditEvent}
        onDelete={onDeleteEvent}
      />

      <EventFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        event={eventToEdit}
        activeCalendarId={activeCalendarId}
      />

      <EventFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create event"
        defaultDate={date}
        defaultTime={selectedHour ? `${String(selectedHour).padStart(2, '0')}:00` : '09:00'}
        defaultCalendarId={activeCalendarId}
        activeCalendarId={activeCalendarId}
      />
    </div>
  );
};
