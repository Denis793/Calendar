import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ConfirmModal from './ConfirmModal';

// Mock Modal component
vi.mock('../Modal/Modal', () => ({
  Modal: ({ isOpen, onClose, title, size, children }: any) =>
    isOpen ? (
      <div data-testid="modal" data-title={title} data-size={size}>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

// Mock Button component
vi.mock('../Button/Button', () => ({
  default: ({ variant, onClick, children, ...props }: any) => (
    <button data-testid={props['data-testid']} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('ConfirmModal', () => {
  it('renders when isOpen is true', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure you want to delete this item?"
      />
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-content')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-message')).toBeInTheDocument();
    expect(screen.getByTestId('button-group')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ConfirmModal isOpen={false} onClose={onClose} onConfirm={onConfirm} message="Are you sure?" />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('displays the message correctly', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const message = 'Are you sure you want to delete this item?';

    render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message={message} />);

    expect(screen.getByTestId('confirm-message')).toHaveTextContent(message);
  });

  it('uses default title when not provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message="Test message" />);

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveAttribute('data-title', 'Confirmation');
  });

  it('uses custom title when provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message="Test message" title="Custom Title" />
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveAttribute('data-title', 'Custom Title');
  });

  it('uses default button texts when not provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message="Test message" />);

    expect(screen.getByTestId('cancel-button')).toHaveTextContent('Cancel');
    expect(screen.getByTestId('confirm-button')).toHaveTextContent('Delete');
  });

  it('uses custom button texts when provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Test message"
        confirmText="Yes"
        cancelText="No"
      />
    );

    expect(screen.getByTestId('cancel-button')).toHaveTextContent('No');
    expect(screen.getByTestId('confirm-button')).toHaveTextContent('Yes');
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message="Test message" />);

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm and onClose when confirm button is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message="Test message" />);

    fireEvent.click(screen.getByTestId('confirm-button'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sets correct button variants', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message="Test message" />);

    expect(screen.getByTestId('cancel-button')).toHaveAttribute('data-variant', 'secondary');
    expect(screen.getByTestId('confirm-button')).toHaveAttribute('data-variant', 'primary');
  });

  it('sets modal size to small', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<ConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} message="Test message" />);

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveAttribute('data-size', 'small');
  });
});
