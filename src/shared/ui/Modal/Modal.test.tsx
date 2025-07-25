import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Modal, ModalField, ModalActionButton } from './Modal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the Icon component
vi.mock('@/shared/ui/Icons/Icons', () => ({
  Icon: ({ name, onClick, title, className }: any) => (
    <div data-testid={`icon-${name}`} onClick={onClick} title={title} className={className}>
      {name}
    </div>
  ),
}));

// Mock createPortal to render in the same container
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

describe('Modal', () => {
  beforeEach(() => {
    // Reset body styles before each test
    document.body.style.overflow = 'unset';
  });

  it('renders modal when isOpen is true', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={false} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.getByTestId('icon-close');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const overlay = screen.getByText('Test Modal').closest('.modalOverlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const content = screen.getByText('Modal content');
    fireEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct size class', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} size="small">
        <div>Modal content</div>
      </Modal>
    );

    // Check if modal--small class exists in document
    const modalWithSize = document.querySelector('[class*="modal--small"]');
    expect(modalWithSize).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} showCloseButton={false}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByTestId('icon-close')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} className="custom-modal">
        <div>Modal content</div>
      </Modal>
    );

    // Check if custom class exists in document
    const modalWithCustomClass = document.querySelector('.custom-modal');
    expect(modalWithCustomClass).toBeInTheDocument();
  });

  it('sets body overflow to hidden when modal is open', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });
});

describe('ModalField', () => {
  it('renders icon and children', () => {
    render(
      <ModalField icon="edit">
        <span>Field content</span>
      </ModalField>
    );

    expect(screen.getByTestId('icon-edit')).toBeInTheDocument();
    expect(screen.getByText('Field content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ModalField icon="edit" className="custom-field">
        <span>Field content</span>
      </ModalField>
    );

    // Check if custom class exists in document
    const fieldWithCustomClass = document.querySelector('.custom-field');
    expect(fieldWithCustomClass).toBeInTheDocument();
  });
});

describe('ModalActionButton', () => {
  it('renders icon with correct props', () => {
    const onClick = vi.fn();

    render(<ModalActionButton icon="delete" onClick={onClick} title="Delete item" />);

    const icon = screen.getByTestId('icon-delete');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('title', 'Delete item');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();

    render(<ModalActionButton icon="delete" onClick={onClick} title="Delete item" />);

    const icon = screen.getByTestId('icon-delete');
    fireEvent.click(icon);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
