import React, { useRef, useState, useEffect } from 'react';

export const DragDropContext = ({
  children,
  onDragOverCell,
  onDropCell,
  onDragStartEvent,
  onDragEndEvent,
  draggedEvent,
  setDraggedEvent,
  dragPosition,
  setDragPosition,
  cellHeightPx,
  workingHours,
  daySlotRefs,
}) => {
  const rafRef = useRef(null);
  const [resizeData, setResizeData] = useState(null);

  const handleDragOver = (e, day, dayIndex) => {
    e.preventDefault();
    if ((!draggedEvent && !resizeData) || cellHeightPx === 0) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const daySlotRef = daySlotRefs.current[dayIndex];
      if (!daySlotRef) return;
      const rect = daySlotRef.getBoundingClientRect();
      const intervalsPerHour = 60 / workingHours.intervalMinutes;
      const pixelsPerInterval = cellHeightPx / intervalsPerHour;
      let offsetY = e.clientY - rect.top;
      const maxHeight = cellHeightPx * workingHours.length;
      if (offsetY < 0) offsetY = 0;
      if (offsetY > maxHeight) offsetY = maxHeight;
      const absoluteIntervalIndex = Math.floor(offsetY / pixelsPerInterval);

      setDragPosition({ day, absoluteIntervalIndex });
      if (onDragOverCell) onDragOverCell(e, day, dayIndex, absoluteIntervalIndex);
      if (resizeData && resizeData.onResize) {
        resizeData.onResize(day, absoluteIntervalIndex, resizeData.direction);
      }
    });
  };

  const handleDrop = (e, day, dayIndex) => {
    e.preventDefault();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (onDropCell) onDropCell(e, day, dayIndex);
    setDraggedEvent(null);
    setDragPosition(null);
    setResizeData(null);
  };

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    if (onDragStartEvent) onDragStartEvent(e, event);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDragPosition(null);
    setResizeData(null);
    if (onDragEndEvent) onDragEndEvent();
  };

  const handleResizeStart = (event, onResize, direction = 'bottom') => {
    setResizeData({ event, onResize, direction });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizeData) return;

      const { event, onResize, direction } = resizeData;
      const day = new Date(event.date);
      const dayIndex = daySlotRefs.current.findIndex((ref) => {
        return ref?.dataset?.date === day.toISOString().split('T')[0];
      });
      const daySlotRef = daySlotRefs.current[dayIndex];
      if (!daySlotRef || cellHeightPx === 0) return;

      const rect = daySlotRef.getBoundingClientRect();
      let offsetY = e.clientY - rect.top;
      const maxHeight = cellHeightPx * workingHours.length;
      if (offsetY < 0) offsetY = 0;
      if (offsetY > maxHeight) offsetY = maxHeight;

      const intervalsPerHour = 60 / workingHours.intervalMinutes;
      const pixelsPerInterval = cellHeightPx / intervalsPerHour;
      const intervalIndex = Math.floor(offsetY / pixelsPerInterval);

      onResize(day, intervalIndex, direction);
    };

    const handleMouseUp = () => {
      if (resizeData && resizeData.onResizeEnd) {
        resizeData.onResizeEnd();
      }
      setResizeData(null);
    };

    if (resizeData) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeData, daySlotRefs, cellHeightPx, workingHours.intervalMinutes, workingHours.length]);

  return (
    <div>
      {typeof children === 'function'
        ? children({
            handleDrop,
            handleDragOver,
            handleDragStart,
            handleDragEnd,
            draggedEvent,
            dragPosition,
            handleResizeStart,
            handleResizeEnd: () => setResizeData(null),
            resizeData,
          })
        : children}
    </div>
  );
};
