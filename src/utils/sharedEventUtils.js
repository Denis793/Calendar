import { useEventStore } from '@/entities/event/eventStore';
import { useToast } from '@/shared/ui/Toast/ToastContext';
import { showEventToast } from '@/utils/eventHandlers';
import { parseSecureShareLink } from '@/utils/secureShareUtils';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { v4 as uuidv4 } from 'uuid';

const { TOAST_DURATION } = CALENDAR_CONSTANTS;

export const parseSharedEvent = (shareParam) => {
  try {
    const decodedParams = atob(shareParam);
    const urlParams = new URLSearchParams(decodedParams);

    const event = {
      id: urlParams.get('eventId'),
      title: urlParams.get('title'),
      date: urlParams.get('date'),
      startTime: urlParams.get('startTime'),
      endTime: urlParams.get('endTime'),
      calendarId: urlParams.get('calendarId'),
      description: urlParams.get('description') || '',
      color: urlParams.get('color') || '',
      repeat: urlParams.get('repeat') || 'none',
      allDay: urlParams.get('allDay') === 'true',
    };

    return event;
  } catch (error) {
    console.error('Failed to parse shared event:', error);
    return null;
  }
};

export const useSharedEvent = () => {
  const addEvent = useEventStore((state) => state.addEvent);
  const { showToast } = useToast();

  const importSharedEvent = (sharedEvent, targetCalendarId) => {
    if (!sharedEvent) {
      showEventToast('invalidSharedData', showToast, { TOAST_DURATION });
      return false;
    }

    try {
      const newEvent = {
        ...sharedEvent,
        id: uuidv4(),
        calendarId: targetCalendarId,
      };

      addEvent(newEvent);

      showEventToast('eventImported', showToast, { TOAST_DURATION, title: sharedEvent.title });

      return true;
    } catch (error) {
      console.error('Failed to import shared event:', error);
      showEventToast('importError', showToast, { TOAST_DURATION });
      return false;
    }
  };

  return {
    importSharedEvent,
    parseSharedEvent,
  };
};

export const checkForSharedEvent = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const shortId = urlParams.get('s');
  if (shortId) {
    return parseSecureShareLink(shortId);
  }

  const shareParam = urlParams.get('share');
  if (shareParam) {
    return parseSharedEvent(shareParam);
  }

  return null;
};
