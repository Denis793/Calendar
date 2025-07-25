import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './CalendarEvent.module.scss';

export const CalendarEvent = ({ event, onClick, onDragStart, onDragEnd, onResizeStart, onResize, style, title }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart?.(e, event);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleResizeMouse = (direction) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    if (onResizeStart) {
      onResizeStart(event, onResize, direction);
    }

    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const handleEventClick = (e) => {
    if (isResizing) return;
    onClick?.(e);
  };

  return (
    <div
      className={classNames(styles.event, { [styles.dragging]: isDragging })}
      style={{
        ...style,
        '--event-z-index': style?.zIndex,
      }}
      onClick={handleEventClick}
      title={title}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className={styles.resizeHandleTop} draggable={false} onMouseDown={handleResizeMouse('top')} />
      <div className={styles.eventTitle}>{event.title}</div>
      <div className={styles.eventTime}>
        {event.startTime} - {event.endTime}
      </div>

      <div className={styles.resizeHandleBottom} draggable={false} onMouseDown={handleResizeMouse('bottom')} />
    </div>
  );
};
