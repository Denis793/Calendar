// Базові типи для календаря

export interface Calendar {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  isDefault: boolean;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  weekly: boolean;
  color?: string;
  calendarId: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DateStore {
  currentDate: Date;
  viewMode: 'day' | 'week';
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'day' | 'week') => void;
  goToToday: () => void;
  goToPrev: () => void;
  goToNext: () => void;
}

export interface CalendarStore {
  calendars: Calendar[];
  activeCalendarId: string | null;
  addCalendar: (calendar: Omit<Calendar, 'id'>) => void;
  updateCalendar: (id: string, updates: Partial<Calendar>) => void;
  removeCalendar: (id: string) => void;
  toggleCalendarVisibility: (id: string) => void;
  setActiveCalendar: (id: string) => void;
  getActiveCalendar: () => Calendar | null;
  fetchCalendars: () => Promise<void>;
}

export interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  fetchEvents: () => Promise<void>;
}

// UI компонентів типи
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  type?: string;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  calendarColor?: string;
  className?: string;
}

export interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  occupiedDates?: Date[];
}

export interface DropdownProps {
  options: DropdownOption[];
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface SelectMenuProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  width?: number;
  isOptionDisabled?: (option: SelectOption) => boolean;
}

export interface SelectOption {
  key: string;
  label: string | React.ReactNode;
  value: string;
  isBusy?: boolean;
}

export interface IconProps {
  name: string;
  size?: string | number;
  className?: string;
  onClick?: () => void;
  title?: string;
  style?: React.CSSProperties;
}

// Toast типи
export interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Формики та валідації
export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  allDay: boolean;
  weekly: boolean;
  color: string;
  calendarId: string;
}

// Константи
export interface CalendarConstants {
  START_HOUR: number;
  END_HOUR: number;
  INTERVAL_MINUTES: number;
  HOUR_HEIGHT_REM: number;
  WEEK_DAYS_COUNT: number;
  EVENT_OPACITY: number;
  BORDER_DARKEN_AMOUNT: number;
  DEFAULT_EVENT_COLOR: string;
  FORMAT_DATE: string;
  TOAST_DURATION: number;
  DEFAULT_CALENDAR_DATA: Partial<Calendar>;
}

// Утиліти
export interface TimeOption {
  key: string;
  label: string;
  value: string;
  isBusy?: boolean;
}

export interface EventStyleProps {
  START_HOUR: number;
  HOUR_HEIGHT_REM: number;
  EVENT_OPACITY: number;
  BORDER_DARKEN_AMOUNT: number;
  addOpacity: (color: string, opacity: number) => string;
  darkenColor: (color: string, amount: number) => string;
  isSameDay: (date1: Date, date2: Date) => boolean;
  getEventWithCalendarColor: (event: Event) => Event;
}

export interface RepeatOption {
  label: string;
  value: string;
}

// DragDrop типи
export interface DragDropHandlers {
  handleDragStart: (e: React.DragEvent, event: Event) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, day: Date, dayIndex: number) => void;
  handleDrop: (e: React.DragEvent, day: Date, dayIndex: number) => void;
  handleResizeStart: (
    event: Event,
    onResize: (day: Date, intervalIndex: number, direction?: string) => void,
    direction?: string
  ) => void;
  handleResizeEnd: () => void;
  resizeData?: any;
}

export interface CalendarEventProps {
  event: Event;
  onClick?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent, event: Event) => void;
  onDragEnd?: () => void;
  onResizeStart?: (
    event: Event,
    onResize: (day: Date, intervalIndex: number, direction?: string) => void,
    direction?: string
  ) => void;
  onResizeEnd?: () => void;
  onResize?: (day: Date, intervalIndex: number, direction?: string) => void;
  style?: React.CSSProperties;
  title?: string;
  draggable?: boolean;
  activeCalendar?: Calendar;
}
