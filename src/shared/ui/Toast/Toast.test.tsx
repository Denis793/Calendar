import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from './Toast';

vi.mock('../Icons', () => ({
  Icon: ({ onClick, onKeyDown, 'aria-label': ariaLabel, className, name, size, tabIndex, role }: any) => (
    <div
      data-testid="close-icon"
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      className={className}
      role={role}
      tabIndex={tabIndex}
      data-icon-name={name}
      data-size={size}
    >
      Close Icon
    </div>
  ),
}));

describe('Toast component', () => {
  const defaultProps = {
    message: 'Test toast message',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with message', () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByText('Test toast message')).toBeInTheDocument();
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Test toast message');
  });

  test('renders close icon with correct props', () => {
    render(<Toast {...defaultProps} />);

    const closeIcon = screen.getByTestId('close-icon');
    expect(closeIcon).toBeInTheDocument();
    expect(closeIcon).toHaveAttribute('aria-label', 'Close toast');
    expect(closeIcon).toHaveAttribute('role', 'button');
    expect(closeIcon).toHaveAttribute('tabIndex', '0');
    expect(closeIcon).toHaveAttribute('data-icon-name', 'close');
    expect(closeIcon).toHaveAttribute('data-size', '24');
  });

  test('calls onClose when close icon is clicked', () => {
    const onClose = vi.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('close-icon'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Enter key is pressed on close icon', () => {
    const onClose = vi.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.keyDown(closeIcon, { key: 'Enter' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Space key is pressed on close icon', () => {
    const onClose = vi.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.keyDown(closeIcon, { key: ' ' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose for other keys', () => {
    const onClose = vi.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.keyDown(closeIcon, { key: 'Escape' });
    fireEvent.keyDown(closeIcon, { key: 'Tab' });
    expect(onClose).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    render(<Toast {...defaultProps} className="custom-toast" />);

    const toastElement = screen.getByText('Test toast message').closest('div');
    expect(toastElement?.className).toMatch(/custom-toast/);
  });

  test('applies data-testid when provided', () => {
    render(<Toast {...defaultProps} data-testid="my-toast" />);

    expect(screen.getByTestId('my-toast')).toBeInTheDocument();
  });

  test('prevents default behavior on Enter and Space key press', () => {
    const onClose = vi.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);

    const closeIcon = screen.getByTestId('close-icon');

    fireEvent.keyDown(closeIcon, { key: 'Enter' });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(closeIcon, { key: ' ' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('has correct CSS class structure', () => {
    render(<Toast {...defaultProps} />);

    const toastElement = screen.getByText('Test toast message').closest('div');
    expect(toastElement?.className).toMatch(/toast/);

    const messageElement = screen.getByTestId('toast-message');
    expect(messageElement.className).toMatch(/toastMessage/);

    const closeIcon = screen.getByTestId('close-icon');
    expect(closeIcon.className).toMatch(/closeIcon/);
  });

  test('handles empty message', () => {
    render(<Toast message="" onClose={vi.fn()} />);

    const messageElement = screen.getByTestId('toast-message');
    expect(messageElement).toHaveTextContent('');
  });

  test('handles very long message', () => {
    const longMessage =
      'This is a very long toast message that should still be displayed correctly without breaking the layout or functionality of the toast component';
    render(<Toast message={longMessage} onClose={vi.fn()} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
