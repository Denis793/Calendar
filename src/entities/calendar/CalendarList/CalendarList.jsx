import React, { useState } from 'react';
import { Icon } from '@/shared/ui/Icons';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { ColorPicker } from '@/shared/ui/ColorPicker';
import { useToast } from '@/shared/ui/Toast/ToastContext';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { useEventStore } from '@/entities/event/eventStore';
import { useCalendarStore } from '@/entities/calendar/calendarStore';
import styles from './CalendarList.module.scss';
import classNames from 'classnames';

const { TOAST_DURATION, DEFAULT_CALENDAR_DATA } = CALENDAR_CONSTANTS;

export const CalendarList = () => {
  const calendars = useCalendarStore((state) => state.calendars);
  const addCalendar = useCalendarStore((state) => state.addCalendar);
  const updateCalendar = useCalendarStore((state) => state.updateCalendar);
  const toggleCalendarVisibility = useCalendarStore((state) => state.toggleCalendarVisibility);
  const removeCalendar = useCalendarStore((state) => state.removeCalendar);
  const setActiveCalendar = useCalendarStore((state) => state.setActiveCalendar);
  const activeCalendarId = useCalendarStore((state) => state.activeCalendarId);

  const { events, removeEvent } = useEventStore();
  const { showToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [calendarToDelete, setCalendarToDelete] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_CALENDAR_DATA);

  const handleCreateNewCalendar = () => {
    setFormData(DEFAULT_CALENDAR_DATA);
    setIsCreateModalOpen(true);
  };

  const handleEditCalendarClick = (calendar) => {
    if (calendar.visible) {
      showToast({
        message: 'Cannot edit completed calendar. Mark it as incomplete first by unchecking the checkbox.',
        duration: TOAST_DURATION,
      });
      return;
    }

    setEditingCalendar(calendar);
    setFormData({
      name: calendar.name,
      color: calendar.color,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteCalendar = (calendar) => {
    if (calendar.isDefault) {
      showToast({
        message: 'Cannot delete default calendar',
        duration: TOAST_DURATION,
      });
      return;
    }

    if (calendars.length <= 1) {
      showToast({
        message: 'Cannot delete the last remaining calendar',
        duration: TOAST_DURATION,
      });
      return;
    }

    setCalendarToDelete(calendar);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!calendarToDelete) return;

    const calendarEvents = events.filter((event) => event.calendarId === calendarToDelete.id);

    calendarEvents.forEach((event) => {
      removeEvent(event.id);
    });

    removeCalendar(calendarToDelete.id);

    showToast({
      message: `Calendar "${calendarToDelete.name}" and ${calendarEvents.length} events have been deleted`,
      duration: TOAST_DURATION,
    });

    setIsDeleteModalOpen(false);
    setCalendarToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCalendarToDelete(null);
  };

  const handleCalendarClick = (calendar) => {
    setActiveCalendar(calendar.id);
    showToast({
      message: `Switched to "${calendar.name}" calendar`,
      duration: TOAST_DURATION,
    });
  };

  const handleCalendarVisibilityToggle = (calendarId) => {
    const calendar = calendars.find((cal) => cal.id === calendarId);
    const newVisibility = !calendar.visible;

    toggleCalendarVisibility(calendarId);

    showToast({
      message: `Calendar "${calendar.name}" is now ${newVisibility ? 'completed' : 'in progress'}`,
      duration: TOAST_DURATION,
    });
  };

  const handleColorSelect = (color) => {
    setFormData({ ...formData, color });
  };

  const handleCreateSave = () => {
    if (!formData.name.trim()) {
      showToast({
        message: 'Calendar name is required',
        duration: TOAST_DURATION,
      });
      return;
    }

    const newCalendarData = {
      name: formData.name.trim(),
      color: formData.color,
      visible: false,
    };

    addCalendar(newCalendarData);

    setIsCreateModalOpen(false);
    setFormData(DEFAULT_CALENDAR_DATA);

    showToast({
      message: `Calendar "${formData.name}" has been created and is now active`,
      duration: TOAST_DURATION,
    });
  };

  const handleEditSave = () => {
    if (!formData.name.trim()) {
      showToast({
        message: 'Calendar name is required',
        duration: TOAST_DURATION,
      });
      return;
    }

    updateCalendar(editingCalendar.id, {
      name: formData.name.trim(),
      color: formData.color,
    });

    setIsEditModalOpen(false);
    setEditingCalendar(null);
    setFormData(DEFAULT_CALENDAR_DATA);

    showToast({
      message: `Calendar "${formData.name}" has been updated`,
      duration: TOAST_DURATION,
    });
  };

  const getEventsCount = (calendar) => {
    return events.filter((event) => event.calendarId === calendar?.id).length;
  };

  return (
    <>
      <div className={styles.calendarListContainer}>
        <div className={styles.calendarListHeader}>
          <h4>My calendars</h4>
          <Icon name="plus" onClick={handleCreateNewCalendar} className="icon" title="Create new calendar" />
        </div>

        {calendars.length === 0 ? (
          <p className={styles.calendarListDescription}>There are no calendars</p>
        ) : (
          <ul className={styles.calendarList}>
            {calendars.map((calendar) => (
              <li
                key={`calendar-${calendar.id}`}
                className={classNames(styles.calendarItem, {
                  [styles.unlocked]: !calendar.visible,
                  [styles.active]: calendar.id === activeCalendarId,
                  [styles.locked]: calendar.visible,
                })}
              >
                <span
                  className={styles.checkboxContainer}
                  style={{
                    '--calendar-color': calendar.color,
                    color: calendar.color,
                  }}
                >
                  <Checkbox
                    checked={calendar.visible}
                    onChange={() => handleCalendarVisibilityToggle(calendar.id)}
                    calendarColor={calendar.color}
                  />
                </span>
                <span
                  className={classNames(styles.calendarName, {
                    [styles.unlocked]: !calendar.visible,
                  })}
                  onClick={() => handleCalendarClick(calendar)}
                >
                  {calendar.name}
                  {calendar.id === activeCalendarId && <span className={styles.activeIndicator}> (active)</span>}
                </span>
                <span className={styles.eventCount}>
                  ({events.filter((event) => event.calendarId === calendar.id).length})
                </span>
                <div className={styles.actions}>
                  <Icon
                    className={classNames('icon', {
                      [styles.disabledIcon]: calendar.visible,
                    })}
                    name="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCalendarClick(calendar);
                    }}
                    title={calendar.visible ? 'Cannot edit completed calendar' : 'Edit calendar'}
                    style={{
                      cursor: !calendar.visible ? 'pointer' : 'not-allowed',
                      opacity: !calendar.visible ? 1 : 0.5,
                    }}
                  />
                  <Icon
                    className={classNames('icon', {
                      [styles.disabledIcon]: calendars.length <= 1 || calendar.isDefault,
                    })}
                    name="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!calendar.isDefault && calendars.length > 1) {
                        handleDeleteCalendar(calendar);
                      }
                    }}
                    title={
                      calendar.isDefault
                        ? 'Cannot delete default calendar'
                        : calendars.length <= 1
                        ? 'Cannot delete the last remaining calendar'
                        : 'Delete calendar'
                    }
                    style={{
                      cursor: !calendar.isDefault && calendars.length > 1 ? 'pointer' : 'not-allowed',
                      opacity: !calendar.isDefault && calendars.length > 1 ? 1 : 0.5,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create calendar"
        size="medium"
      >
        <div className={styles.calendarModalContent}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter title"
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label>Color</label>
            <ColorPicker selectedColor={formData.color} onColorSelect={handleColorSelect} />
          </div>

          <div className={styles.modalActions}>
            <Button type="button" variant="primary" onClick={handleCreateSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit calendar" size="medium">
        <div className={styles.calendarModalContent}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter title"
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label>Color</label>
            <ColorPicker selectedColor={formData.color} onColorSelect={handleColorSelect} />
          </div>

          <div className={styles.modalActions}>
            <Button type="button" variant="primary" onClick={handleEditSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Calendar"
        size="medium"
        showCloseButton={false}
      >
        <div className={styles.deleteModalContent}>
          <div className={styles.deleteDescription}>
            <p>
              Are you sure you want to delete calendar <strong>"{calendarToDelete?.name}"</strong>?
            </p>
            {getEventsCount(calendarToDelete) > 0 && (
              <p>
                <strong>Warning:</strong> This calendar contains {getEventsCount(calendarToDelete)} events. All events
                will be permanently removed.
              </p>
            )}
            <p>This action cannot be undone.</p>
          </div>

          <div className={styles.deleteModalActions}>
            <Button type="button" variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleConfirmDelete}>
              Delete Calendar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
