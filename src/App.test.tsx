import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

vi.mock('@/entities/date/dateStore', () => ({
  useDateStore: () => ({
    viewMode: 'day',
    currentDate: new Date('2024-01-01'),
  }),
}));

vi.mock('@/entities/calendar/calendarStore', () => ({
  useCalendarStore: () => ({
    fetchCalendars: vi.fn().mockResolvedValue([]),
  }),
}));

vi.mock('@/entities/event/eventStore', () => ({
  useEventStore: () => ({
    fetchEvents: vi.fn().mockResolvedValue([]),
  }),
}));

vi.mock('@/features/layout/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/features/layout/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('@/features/dayView/DayView', () => ({
  DayView: ({ date }: { date: Date }) => <div data-testid="day-view">Day View: {date.toString()}</div>,
}));

vi.mock('@/features/weekView/WeekView', () => ({
  WeekView: () => <div data-testid="week-view">Week View</div>,
}));

vi.mock('@/entities/event/ImportSharedEvent', () => ({
  ImportSharedEvent: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="import-shared-event">Import Shared Event</div> : null,
}));

vi.mock('@/shared/ui/Toast/ToastManager', () => ({
  default: () => <div data-testid="toast-manager">Toast Manager</div>,
}));

vi.mock('@/shared/ui/Toast/ToastContext', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-provider">{children}</div>,
}));

vi.mock('@/utils/sharedEventUtils', () => ({
  checkForSharedEvent: vi.fn(() => null),
}));

vi.mock('@/utils/secureShareUtils', () => ({
  cleanupExpiredLinks: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main layout components', () => {
    render(<App />);

    expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('toast-manager')).toBeInTheDocument();
  });

  it('renders day view when viewMode is day', () => {
    render(<App />);

    expect(screen.getByTestId('day-view')).toBeInTheDocument();
    expect(screen.queryByTestId('week-view')).not.toBeInTheDocument();
  });

  it('has proper CSS classes applied', () => {
    render(<App />);

    const mainLayout = screen.getByTestId('toast-provider').firstChild;
    expect(mainLayout).toHaveClass('appLayout');

    const main = screen.getByRole('main');
    expect(main).toHaveClass('main');
  });

  it('does not show import modal by default', () => {
    render(<App />);

    expect(screen.queryByTestId('import-shared-event')).not.toBeInTheDocument();
  });
});
