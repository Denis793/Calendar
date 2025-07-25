import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

// Mock Icon component to avoid SVG issues in tests
vi.mock('../Icons', () => ({
  Icon: ({ name, ...props }: any) => <svg data-testid="icon" {...props} />,
}));

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('has proper button classes', () => {
    render(<Button>Test</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('button');
    expect(button.className).toContain('primary');
  });

  it('applies secondary variant class', () => {
    render(<Button variant="secondary">Test</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('secondary');
  });

  it('applies danger variant class', () => {
    render(<Button variant="danger">Test</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('danger');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Test</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Test</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Test
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with icon when withIcon is true', () => {
    render(<Button withIcon>Test</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not render icon when withIcon is false', () => {
    render(<Button>Test</Button>);

    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('passes through other props', () => {
    render(
      <Button data-testid="custom-button" id="test-id">
        Test
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('id', 'test-id');
  });
});
