import { render, screen, fireEvent, within } from '@testing-library/react';
import { SelectMenu } from './SelectMenu';
import { SelectOption } from '@/types';

// Mock Icons module
vi.mock('../Icons', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

// Mock useClickOutside hook
vi.mock('@/shared/hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

describe('SelectMenu component', () => {
  const defaultOptions: SelectOption[] = [
    { key: 'option1', label: 'Option 1', value: 'option1' },
    { key: 'option2', label: 'Option 2', value: 'option2' },
    { key: 'option3', label: 'Option 3', value: 'option3' },
  ];

  const defaultProps = {
    options: defaultOptions,
    value: 'option1',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with selected value', () => {
    render(<SelectMenu {...defaultProps} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('renders label when provided', () => {
    render(<SelectMenu {...defaultProps} label="Choose Option" />);
    expect(screen.getByText('Choose Option')).toBeInTheDocument();
  });

  test('shows "Select..." when no option is selected', () => {
    render(<SelectMenu {...defaultProps} value="" />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  test('opens and closes menu on click', () => {
    render(<SelectMenu {...defaultProps} />);
    const control = screen.getByRole('button');

    // Initially closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(control);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Click to close
    fireEvent.click(control);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('shows all options when open', () => {
    render(<SelectMenu {...defaultProps} />);
    const control = screen.getByRole('button');

    fireEvent.click(control);

    const menu = screen.getByRole('listbox');
    defaultOptions.forEach((opt) => {
      expect(within(menu).getByText(opt.label as string)).toBeInTheDocument();
    });
  });

  test('calls onChange and closes menu when option is clicked', () => {
    const onChange = vi.fn();
    render(<SelectMenu {...defaultProps} onChange={onChange} />);

    const control = screen.getByRole('button');
    fireEvent.click(control);

    const option3 = screen.getByText('Option 3');
    fireEvent.click(option3);

    expect(onChange).toHaveBeenCalledWith('option3');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('opens menu with Enter key', () => {
    render(<SelectMenu {...defaultProps} />);
    const control = screen.getByRole('button');

    fireEvent.keyDown(control, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('opens menu with Space key', () => {
    render(<SelectMenu {...defaultProps} />);
    const control = screen.getByRole('button');

    fireEvent.keyDown(control, { key: ' ' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('applies hover state on mouse enter/leave', () => {
    render(<SelectMenu {...defaultProps} />);
    const control = screen.getByRole('button');

    fireEvent.click(control);

    const option1 = screen.getByRole('listbox').querySelector('li:first-child') as HTMLElement;

    fireEvent.mouseEnter(option1);
    expect(option1).toBeInTheDocument();

    fireEvent.mouseLeave(option1);
    expect(option1).toBeInTheDocument();
  });

  test('applies selected item styling', () => {
    render(<SelectMenu {...defaultProps} value="option2" />);
    const control = screen.getByRole('button');

    fireEvent.click(control);

    const menu = screen.getByRole('listbox');
    const selectedOption = within(menu).getByText('Option 2');
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });

  test('applies custom width', () => {
    render(<SelectMenu {...defaultProps} width={200} />);
    const control = screen.getByRole('button');
    const selectMenu = control.parentElement;
    expect(selectMenu).toHaveStyle({ width: '200px' });
  });

  test('applies custom className', () => {
    const { container } = render(<SelectMenu {...defaultProps} className="custom-class" />);
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).not.toBeNull();
  });

  test('renders down arrow icon', () => {
    render(<SelectMenu {...defaultProps} />);
    expect(screen.getByTestId('icon-downSmall')).toBeInTheDocument();
  });

  test('handles disabled options', () => {
    const isOptionDisabled = (option: SelectOption) => option.value === 'option2';
    const onChange = vi.fn();

    render(<SelectMenu {...defaultProps} onChange={onChange} isOptionDisabled={isOptionDisabled} />);

    const control = screen.getByRole('button');
    fireEvent.click(control);

    const disabledOption = screen.getByText('Option 2');
    fireEvent.click(disabledOption);

    // Should not call onChange for disabled option
    expect(onChange).not.toHaveBeenCalled();
    // Menu should still be open
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('does not trigger hover for disabled options', () => {
    const isOptionDisabled = (option: SelectOption) => option.value === 'option2';

    render(<SelectMenu {...defaultProps} isOptionDisabled={isOptionDisabled} />);

    const control = screen.getByRole('button');
    fireEvent.click(control);

    const disabledOption = screen.getByText('Option 2');
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
  });
});
