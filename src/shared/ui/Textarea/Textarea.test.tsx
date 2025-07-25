import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea component', () => {
  const defaultProps = {
    value: 'Initial text',
    onChange: vi.fn(),
    id: 'test-textarea',
    name: 'test',
    placeholder: 'Type here...',
  };

  test('renders with basic props', () => {
    render(<Textarea {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Initial text');
    expect(textarea).toHaveAttribute('placeholder', 'Type here...');
    expect(textarea).toHaveAttribute('name', 'test');
    expect(textarea).toHaveAttribute('id', 'test-textarea');
  });

  test('renders label when provided', () => {
    render(<Textarea {...defaultProps} label="Description" />);

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  test('shows required asterisk when required', () => {
    render(<Textarea {...defaultProps} label="Required Field" required />);

    const label = screen.getByText('Required Field');
    expect(label.textContent).toBe('Required Field');
    expect(label.className).toMatch(/required/);
  });

  test('applies disabled styles when disabled', () => {
    render(<Textarea {...defaultProps} label="Disabled Field" disabled />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();

    const label = screen.getByText('Disabled Field');
    expect(label.className).toMatch(/disabledLabel/);
  });

  test('shows error message and applies error styles', () => {
    render(<Textarea {...defaultProps} hasError error="This field is required" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea.className).toMatch(/error/);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('does not show error message when hasError is false', () => {
    render(<Textarea {...defaultProps} hasError={false} error="This field is required" />);

    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  test('does not show error message when error is empty', () => {
    render(<Textarea {...defaultProps} hasError error="" />);

    expect(screen.queryByText(/This field is required/)).not.toBeInTheDocument();
  });

  test('calls onChange when text is changed', () => {
    const onChange = vi.fn();
    render(<Textarea {...defaultProps} onChange={onChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text content' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  test('applies custom rows', () => {
    render(<Textarea {...defaultProps} rows={8} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '8');
  });

  test('uses default rows when not specified', () => {
    render(<Textarea {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  test('applies custom className', () => {
    render(<Textarea {...defaultProps} className="custom-class" data-testid="custom-textarea" />);

    const container = screen.getByTestId('custom-textarea');
    expect(container).toBeTruthy();
    expect(container.className).toMatch(/custom-class/);
  });

  test('passes through additional props', () => {
    render(<Textarea {...defaultProps} maxLength={100} data-custom="test" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxLength', '100');
    expect(textarea).toHaveAttribute('data-custom', 'test');
  });

  test('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Textarea {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  test('applies data-testid when provided', () => {
    render(<Textarea {...defaultProps} data-testid="my-textarea" />);

    expect(screen.getByTestId('my-textarea')).toBeInTheDocument();
  });
});
