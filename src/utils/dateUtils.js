import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { uk } from 'date-fns/locale';

const { START_HOUR, END_HOUR, FORMAT_DATE } = CALENDAR_CONSTANTS;

export const formatDate = (date, formatString = FORMAT_DATE) => {
  return format(date, formatString, { locale: uk });
};

export const getWeekStart = (date) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

export const getWeekEnd = (date) => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

export const getWeekDays = (date) => {
  const weekStart = getWeekStart(date);
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const getWorkingHours = (startHour = START_HOUR, endHour = END_HOUR) => {
  const hours = [];
  for (let i = startHour; i <= endHour; i++) {
    hours.push(i);
  }
  return hours;
};

export const parseDate = (dateString) => {
  if (typeof dateString === 'string') {
    return parseISO(dateString);
  }
  return dateString;
};

export const formatTime = (hour, minute = 0) => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const getNextWeek = (date) => {
  return addDays(date, 7);
};

export const getPreviousWeek = (date) => {
  return addDays(date, -7);
};

export const formatDateForAPI = (date) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
