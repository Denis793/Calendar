import React, { useMemo, useState, useRef, useCallback } from 'react';
import { format, addDays, isSameDay, startOfWeek, isBefore, startOfDay } from 'date-fns';
import { DragDropContext } from '@/features/dragDrop/DragDropContext';
import { CurrentTimeMarker } from '@/widgets/CurrentTimeMarker';
import { useCalendarStore } from '@/entities/calendar/calendarStore';
import { useEventStore } from '@/entities/event/eventStore';

import { getEventStyle } from '@/utils/eventStyle';
import { handleDropEvent } from '@/utils/handleDrop';
import { getResizedEventTimes } from '@/utils/eventResize';
import { darkenColor, addOpacity } from '@/utils/colorUtils';
import { handleEditEvent, handleDeleteEvent, handleDaySlotClick } from '@/utils/eventHandlers';

import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { useToast } from '@/shared/ui/Toast/ToastContext';
import { CalendarEvent } from '@/shared/ui/CalendarEvent';
import { EventInfoModal } from '../EventInfoModal';
import { EventFormModal } from '../EventFormModal';
import { uk } from 'date-fns/locale';
import classNames from 'classnames';
import styles from './WeekGrid.module.scss';

const {
  HOUR_HEIGHT_REM,
  START_HOUR,
  END_HOUR,
  WEEK_DAYS_COUNT,
  EVENT_OPACITY,
  DEFAULT_EVENT_COLOR,
  TOAST_DURATION,
  INTERVAL_MINUTES,
  BORDER_DARKEN_AMOUNT,
} = CALENDAR_CONSTANTS;

export const WeekGrid = ({ date = new Date() }) => {
  const { events, removeEvent, updateEvent } = useEventStore();
  const { activeCalendarId, getActiveCalendar } = useCalendarStore();
  const { showToast } = useToast();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [cellHeightPx, setCellHeightPx] = useState(0);

  const [isEventResizing, setIsEventResizing] = useState(false);
  const wasResizingRef = useRef(false);

  const daySlotRefs = useRef([]);

  const workingHours = useMemo(() => Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR), []);
  const weekStart = useMemo(() => startOfWeek(date, { weekStartsOn: 1 }), [date]);
  const weekDays = useMemo(() => Array.from({ length: WEEK_DAYS_COUNT }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const getAvailableHours = useMemo(() => {
    const hours = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
      hours.push(`${String(i).padStart(2, '0')}:00`);
      if (i < END_HOUR) hours.push(`${String(i).padStart(2, '0')}:30`);
    }
    return hours;
  }, []);

  const weekEvents = useMemo(() => {
    if (!activeCalendarId) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return weekDays.some((day) => isSameDay(eventDate, day)) && event.calendarId === activeCalendarId;
    });
  }, [events, weekDays, activeCalendarId]);

  const getEventWithCalendarColor = (event) => {
    const activeCalendar = getActiveCalendar();
    return {
      ...event,
      color: event.color || activeCalendar?.color || DEFAULT_EVENT_COLOR,
    };
  };

  const isPastDate = (day) => isBefore(startOfDay(day), startOfDay(new Date()));

  const handleEventClick = useCallback(
    (event, e) => {
      if (isEventResizing) return;
      e.stopPropagation();
      setSelectedEvent(event);
      setShowEventModal(true);
    },
    [isEventResizing]
  );

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
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

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEventToEdit(null);
  };

  const onDaySlotClick = (day, hour, e) =>
    handleDaySlotClick(
      day,
      hour,
      e,
      wasResizingRef,
      styles,
      getActiveCalendar,
      showToast,
      isPastDate,
      setSelectedDay,
      setSelectedHour,
      setShowCreateModal,
      TOAST_DURATION
    );

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSelectedDay(null);
    setSelectedHour(null);
  };

  const onCellRef = (el) => {
    if (el) {
      const height = el.getBoundingClientRect().height;
      if (height !== cellHeightPx) setCellHeightPx(height);
    }
  };

  const handleResize = (event, day, absoluteIntervalIndex, direction = 'bottom') => {
    const result = getResizedEventTimes(event, absoluteIntervalIndex, direction, START_HOUR, INTERVAL_MINUTES);
    if (result) updateEvent(event.id, result);
  };

  const handleDrop = (e, day, dayIndex) => {
    handleDropEvent({
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
    });
  };

  const renderDaySlot = (hour, day, dayIndex, dragDropHandlers) => {
    const isToday = isSameDay(day, new Date());
    const dayEvents = weekEvents.filter((event) => isSameDay(new Date(event.date), day));
    const isPast = isBefore(startOfDay(day), startOfDay(new Date()));

    const ref =
      hour === START_HOUR
        ? (el) => {
            if (el) {
              daySlotRefs.current[dayIndex] = el;
              el.dataset.date = day.toISOString().split('T')[0];
            }
          }
        : undefined;
    const extraClass = isPast ? styles.occupied : '';

    return (
      <div
        key={`day-slot-${hour}-${dayIndex}`}
        ref={ref}
        className={classNames(styles.daySlot, { [styles.today]: isToday }, extraClass)}
        style={{ height: `${HOUR_HEIGHT_REM}rem` }}
        onClick={(e) => onDaySlotClick(day, hour, e)}
        onDragOver={dragDropHandlers ? (e) => dragDropHandlers.handleDragOver(e, day, dayIndex) : undefined}
        onDrop={
          dragDropHandlers
            ? (e) => {
                dragDropHandlers.handleDrop(e, day, dayIndex);
                handleDrop(e, day, dayIndex);
              }
            : undefined
        }
      >
        {isToday && hour === START_HOUR && <CurrentTimeMarker />}
        {hour === START_HOUR &&
          dayEvents.map((event) => {
            const style = getEventStyle(event, day, {
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
            return (
              <CalendarEvent
                key={`event-${event.id}`}
                event={event}
                activeCalendar={getActiveCalendar()}
                onClick={(e) => handleEventClick(event, e)}
                style={style}
                draggable
                onDragStart={
                  dragDropHandlers
                    ? (e) => {
                        setDraggedEvent(event);
                        dragDropHandlers.handleDragStart(e, event);
                      }
                    : undefined
                }
                onDragEnd={dragDropHandlers ? dragDropHandlers.handleDragEnd : undefined}
                onResizeStart={
                  dragDropHandlers
                    ? (eventObj, onResize, direction = 'bottom') => {
                        setIsEventResizing(true);
                        wasResizingRef.current = true;
                        dragDropHandlers.handleResizeStart(
                          eventObj,
                          (resizeDay, intervalIndex, dir) => {
                            handleResize(eventObj, resizeDay, intervalIndex, dir || direction);
                          },
                          direction
                        );
                      }
                    : undefined
                }
                onResizeEnd={() => setIsEventResizing(false)}
                onResize={
                  dragDropHandlers && dragDropHandlers.resizeData
                    ? (resizeDay, intervalIndex, direction = 'bottom') => {
                        handleResize(event, resizeDay, intervalIndex, direction);
                      }
                    : undefined
                }
                title={`${event.title}\n${event.startTime} - ${event.endTime}`}
              />
            );
          })}
      </div>
    );
  };

  return (
    <div className={styles.weekGrid}>
      <div className={styles.gridContainer}>
        <div className={styles.daysHeader}>
          <div className={styles.timeColumn}></div>
          {weekDays.map((day, index) => (
            <div key={`day-header-${index}`} className={styles.dayHeader}>
              <div className={styles.dayNumber}>{format(day, 'd')}</div>
              <div className={styles.dayName}>{format(day, 'EEEE', { locale: uk })}</div>
            </div>
          ))}
        </div>
        <DragDropContext
          draggedEvent={draggedEvent}
          setDraggedEvent={setDraggedEvent}
          dragPosition={dragPosition}
          setDragPosition={setDragPosition}
          cellHeightPx={cellHeightPx}
          workingHours={{ length: workingHours.length, intervalMinutes: INTERVAL_MINUTES }}
          daySlotRefs={daySlotRefs}
        >
          {(dragDropHandlers) => (
            <div className={styles.gridBody}>
              <div className={styles.hourRow}>
                <div className={styles.timeSlot}></div>
                {weekDays.map((day, dayIndex) => {
                  const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
                  return (
                    <div
                      key={`decor-row-${dayIndex}`}
                      className={classNames(styles.daySlot, { [styles.occupied]: isPast })}
                    />
                  );
                })}
              </div>
              {workingHours.map((hour) => (
                <div key={`hour-row-${hour}`} className={styles.hourRow}>
                  <div className={styles.timeSlot} ref={hour === START_HOUR ? onCellRef : undefined}>
                    <span className={styles.timeLabel}>{String(hour).padStart(2, '0')}:00</span>
                  </div>
                  {weekDays.map((day, dayIndex) => renderDaySlot(hour, day, dayIndex, dragDropHandlers))}
                </div>
              ))}
            </div>
          )}
        </DragDropContext>
      </div>

      <EventInfoModal
        isOpen={showEventModal}
        onClose={handleCloseEventModal}
        event={selectedEvent}
        onEdit={onEditEvent}
        onDelete={onDeleteEvent}
      />

      <EventFormModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        event={eventToEdit}
        availableHours={getAvailableHours}
        activeCalendarId={activeCalendarId}
      />

      <EventFormModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create event"
        availableHours={getAvailableHours}
        defaultDate={selectedDay}
        defaultTime={
          selectedHour ? `${String(selectedHour).padStart(2, '0')}:00` : `${String(START_HOUR).padStart(2, '0')}:00`
        }
        defaultCalendarId={activeCalendarId}
      />
    </div>
  );
};
