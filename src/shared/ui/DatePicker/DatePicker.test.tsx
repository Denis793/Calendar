import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { format, addDays, subDays } from 'date-fns';
import DatePicker from './DatePicker';

vi.mock('../Icons', () => ({
  Icon: ({ name, onClick, className }: { name: string; onClick?: () => void; className?: string }) => (
    <button className={className} onClick={onClick} data-testid={`icon-${name}`}>
      {name}
    </button>
  ),
}));

describe('DatePicker', () => {
  it('renders datepicker container', () => {
    render(<DatePicker selectedDate={new Date(2025, 6, 25)} onDateChange={vi.fn()} occupiedDates={[]} />);

    expect(screen.getByTestId('datepicker-container')).toBeInTheDocument();
    expect(screen.getByTestId('datepicker-header')).toBeInTheDocument();
    expect(screen.getByTestId('days-row')).toBeInTheDocument();
  });

  it('displays current month and year', () => {
    const testDate = new Date(2025, 6, 25);
    render(<DatePicker selectedDate={testDate} onDateChange={vi.fn()} occupiedDates={[]} />);

    expect(screen.getByText('July 2025')).toBeInTheDocument();
  });

  it('displays navigation arrows', () => {
    render(<DatePicker selectedDate={new Date(2025, 6, 25)} onDateChange={vi.fn()} occupiedDates={[]} />);

    expect(screen.getByTestId('icon-arrowLeft')).toBeInTheDocument();
    expect(screen.getByTestId('icon-arrowRight')).toBeInTheDocument();
  });

  it('displays day labels', () => {
    render(<DatePicker selectedDate={new Date(2025, 6, 25)} onDateChange={vi.fn()} occupiedDates={[]} />);

    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('calls onDateChange when a date is clicked', () => {
    const mockOnDateChange = vi.fn();
    const today = new Date(2025, 6, 25);
    const tomorrow = addDays(today, 1);

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} occupiedDates={[]} />);

    const dateString = format(tomorrow, 'yyyy-MM-dd');
    const dateCell = screen.getByTestId(`date-cell-${dateString}`);

    fireEvent.click(dateCell);

    expect(mockOnDateChange).toHaveBeenCalledWith(tomorrow);
  });

  it('shows selected date with selected class', () => {
    const selectedDate = new Date(2025, 6, 25);

    render(<DatePicker selectedDate={selectedDate} onDateChange={vi.fn()} occupiedDates={[]} />);

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const selectedCell = screen.getByTestId(`date-cell-${dateString}`);

    expect(selectedCell).toHaveClass('_selected_f14d1c');
  });

  it('navigates to previous month when left arrow is clicked', () => {
    const testDate = new Date(2025, 6, 25);

    render(<DatePicker selectedDate={testDate} onDateChange={vi.fn()} occupiedDates={[]} />);

    const currentMonth = format(testDate, 'MMMM yyyy');
    expect(screen.getByText(currentMonth)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('icon-arrowLeft'));

    const prevMonth = format(new Date(2025, 5, 25), 'MMMM yyyy');
    expect(screen.getByText(prevMonth)).toBeInTheDocument();
  });

  it('navigates to next month when right arrow is clicked', () => {
    const testDate = new Date(2025, 6, 25);

    render(<DatePicker selectedDate={testDate} onDateChange={vi.fn()} occupiedDates={[]} />);

    const currentMonth = format(testDate, 'MMMM yyyy');
    expect(screen.getByText(currentMonth)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('icon-arrowRight'));

    const nextMonth = format(new Date(2025, 7, 25), 'MMMM yyyy');
    expect(screen.getByText(nextMonth)).toBeInTheDocument();
  });

  it('shows occupied dates with occupied dots', () => {
    const today = new Date(2025, 6, 25);
    const occupiedDate = addDays(today, 1);

    render(<DatePicker selectedDate={today} onDateChange={vi.fn()} occupiedDates={[occupiedDate]} />);

    const dateString = format(occupiedDate, 'yyyy-MM-dd');
    const occupiedCell = screen.getByTestId(`date-cell-${dateString}`);

    expect(occupiedCell).toHaveClass('_occupied_f14d1c');
    expect(occupiedCell.querySelector('[data-testid="occupied-dot"]')).toBeInTheDocument();
  });

  it('disables past dates', () => {
    const today = new Date(2025, 6, 25);
    const yesterday = subDays(today, 1);

    render(<DatePicker selectedDate={today} onDateChange={vi.fn()} occupiedDates={[]} />);

    const dateString = format(yesterday, 'yyyy-MM-dd');
    const pastCell = screen.getByTestId(`date-cell-${dateString}`);

    expect(pastCell).toHaveClass('_disabled_f14d1c');
    expect(pastCell).toHaveStyle('cursor: not-allowed');
  });

  it('does not call onDateChange when disabled date is clicked', () => {
    const mockOnDateChange = vi.fn();
    const today = new Date(2025, 6, 25);
    const yesterday = subDays(today, 1);

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} occupiedDates={[]} />);

    const dateString = format(yesterday, 'yyyy-MM-dd');
    const pastCell = screen.getByTestId(`date-cell-${dateString}`);

    fireEvent.click(pastCell);

    expect(mockOnDateChange).not.toHaveBeenCalled();
  });

  it('handles null selectedDate', () => {
    render(<DatePicker selectedDate={null} onDateChange={vi.fn()} occupiedDates={[]} />);

    expect(screen.getByTestId('datepicker-container')).toBeInTheDocument();
    const currentMonth = format(new Date(), 'MMMM yyyy');
    expect(screen.getByText(currentMonth)).toBeInTheDocument();
  });

  it('shows tooltip for occupied dates', () => {
    const today = new Date(2025, 6, 25);
    const occupiedDate = addDays(today, 1);

    render(<DatePicker selectedDate={today} onDateChange={vi.fn()} occupiedDates={[occupiedDate]} />);

    const dateString = format(occupiedDate, 'yyyy-MM-dd');
    const occupiedCell = screen.getByTestId(`date-cell-${dateString}`);

    expect(occupiedCell).toHaveAttribute('title', 'This date has events');
  });
});
