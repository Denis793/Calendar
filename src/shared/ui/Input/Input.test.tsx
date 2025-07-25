import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input, UsernamePasswordInputs } from './Input';

// Mock Icon component to avoid SVG issues in tests
vi.mock('../Icons', () => ({
  Icon: ({ name, ...props }: any) => <svg data-testid={`icon-${name}`} {...props} />,
}));

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input placeholder="Test placeholder" />);

    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('shows error message when hasError is true', () => {
    render(<Input hasError error="Test error" />);

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('does not show error message when hasError is false', () => {
    render(<Input hasError={false} error="Test error" />);

    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });

  it('applies error styling when hasError is true', () => {
    render(<Input hasError />);

    const input = screen.getByRole('textbox');
    expect(input.className).toContain('errorBorder');
  });

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies required styling when required is true', () => {
    render(<Input label="Test" required />);

    const label = screen.getByText('Test');
    expect(label.className).toContain('required');
  });

  describe('Password input', () => {
    it('renders password toggle button', () => {
      render(<Input type="password" />);

      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('toggles password visibility when toggle button is clicked', () => {
      render(<Input type="password" value="" onChange={() => {}} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: 'Show password' });

      expect(input.type).toBe('password');

      fireEvent.click(toggleButton);

      expect(input.type).toBe('text');
      expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });

    it('toggles password visibility with keyboard', () => {
      render(<Input type="password" value="" onChange={() => {}} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: 'Show password' });

      expect(input.type).toBe('password');

      fireEvent.keyDown(toggleButton, { key: 'Enter' });

      expect(input.type).toBe('text');
    });

    it('shows correct icon for password visibility state', () => {
      render(<Input type="password" value="" onChange={() => {}} />);

      expect(screen.getByTestId('icon-eyeClose')).toBeInTheDocument();

      const toggleButton = screen.getByRole('button', { name: 'Show password' });
      fireEvent.click(toggleButton);

      expect(screen.getByTestId('icon-eyeOpen')).toBeInTheDocument();
    });
  });
});

describe('UsernamePasswordInputs', () => {
  it('renders username and password inputs', () => {
    render(<UsernamePasswordInputs />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('passes props to username input', () => {
    render(<UsernamePasswordInputs usernameProps={{ defaultValue: 'test-user' }} />);

    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    expect(usernameInput.defaultValue).toBe('test-user');
  });

  it('passes props to password input', () => {
    render(<UsernamePasswordInputs passwordProps={{ hasError: true, error: 'Password error' }} />);

    expect(screen.getByText('Password error')).toBeInTheDocument();
  });
});
