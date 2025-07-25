import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Checkbox from './Checkbox';

// Mock the Icon component
vi.mock('@/shared/ui/Icons/Icons', () => ({
  Icon: ({ name, className }: any) => (
    <div data-testid={`icon-${name}`} className={className}>
      {name}
    </div>
  ),
}));

describe('Checkbox', () => {
  it('renders with correct attributes', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} name="test-checkbox" />);

    const input = screen.getByTestId('checkbox-input');
    const label = screen.getByTestId('checkbox-label');
    const container = screen.getByTestId('checkbox-container');

    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(container).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).toHaveAttribute('name', 'test-checkbox');
  });

  it('shows checked state correctly', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={true} onChange={onChange} />);

    const input = screen.getByTestId('checkbox-input');
    expect(input).toBeChecked();
  });

  it('shows unchecked state correctly', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} />);

    const input = screen.getByTestId('checkbox-input');
    expect(input).not.toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} />);

    const input = screen.getByTestId('checkbox-input');
    fireEvent.click(input);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} disabled={true} />);

    const input = screen.getByTestId('checkbox-input');
    const container = screen.getByTestId('checkbox-container');

    expect(input).toBeDisabled();
    expect(container.className).toContain('disabled');
  });

  it('does not call onChange when disabled and clicked', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} disabled={true} />);

    const input = screen.getByTestId('checkbox-input');
    fireEvent.click(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses custom id when provided', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} id="custom-id" />);

    const input = screen.getByTestId('checkbox-input');
    const label = screen.getByTestId('checkbox-label');

    expect(input).toHaveAttribute('id', 'custom-id');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('applies custom calendar color', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} calendarColor="#ff0000" />);

    const container = screen.getByTestId('checkbox-container');

    expect(container).toHaveStyle({
      '--checkbox-color': '#ff0000',
      '--checkbox-border-color': '#ff0000',
    });
  });

  it('renders check icon', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} />);

    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    const onChange = vi.fn();

    render(<Checkbox checked={false} onChange={onChange} data-custom="test-value" />);

    const input = screen.getByTestId('checkbox-input');
    expect(input).toHaveAttribute('data-custom', 'test-value');
  });
});
