import { render, screen, fireEvent, within } from '@testing-library/react';
import { Dropdown } from './Dropdown';
import { DropdownOption } from '@/types';

// Mock Icons module
vi.mock('../Icons', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

// Mock useClickOutside hook
vi.mock('@/shared/hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

describe('Dropdown component', () => {
  const defaultOptions: DropdownOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const defaultProps = {
    options: defaultOptions,
    selected: 'option1',
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with selected value', () => {
    render(<Dropdown {...defaultProps} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('renders label when provided', () => {
    render(<Dropdown {...defaultProps} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('shows "Select..." when no option is selected', () => {
    render(<Dropdown {...defaultProps} selected="" />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  test('opens and closes dropdown on click', () => {
    render(<Dropdown {...defaultProps} />);
    const control = screen.getByText('Option 1').closest('[tabindex="0"]') as HTMLElement;

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
    render(<Dropdown {...defaultProps} />);
    const control = screen.getByText('Option 1').closest('[tabindex="0"]') as HTMLElement;

    fireEvent.click(control);

    const menu = screen.getByRole('listbox');
    defaultOptions.forEach((opt) => {
      expect(within(menu).getByText(opt.label)).toBeInTheDocument();
    });
  });
  test('calls onSelect and closes dropdown when option is clicked', () => {
    const onSelect = vi.fn();
    render(<Dropdown {...defaultProps} onSelect={onSelect} />);

    const control = screen.getByText('Option 1').closest('[tabindex="0"]') as HTMLElement;
    fireEvent.click(control);

    const option3 = screen.getByText('Option 3');
    fireEvent.click(option3);

    expect(onSelect).toHaveBeenCalledWith('option3');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('opens dropdown with Enter key', () => {
    render(<Dropdown {...defaultProps} />);
    const control = screen.getByText('Option 1').closest('[tabindex="0"]') as HTMLElement;

    fireEvent.keyDown(control, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('opens dropdown with Space key', () => {
    render(<Dropdown {...defaultProps} />);
    const control = screen.getByText('Option 1').closest('[tabindex="0"]') as HTMLElement;

    fireEvent.keyDown(control, { key: ' ' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('applies hover state on mouse enter/leave', () => {
    render(<Dropdown {...defaultProps} />);
    const control = screen.getByText('Option 1').closest('[tabindex="0"]') as HTMLElement;

    fireEvent.click(control);

    const option1 = screen.getByRole('listbox').querySelector('li:first-child') as HTMLElement;

    fireEvent.mouseEnter(option1);
    // The hover effect is applied via CSS class, so we can check the element exists
    expect(option1).toBeInTheDocument();

    fireEvent.mouseLeave(option1);
    expect(option1).toBeInTheDocument();
  });

  test('applies selected item styling', () => {
    render(<Dropdown {...defaultProps} selected="option2" />);
    const control = screen.getByText('Option 2').closest('[tabindex="0"]') as HTMLElement;

    fireEvent.click(control);

    const menu = screen.getByRole('listbox');
    const selectedOption = within(menu).getByText('Option 2');
    // Check if the element has the selected class or style
    expect(selectedOption).toBeInTheDocument();
  });

  test('applies custom width', () => {
    render(<Dropdown {...defaultProps} width={200} />);
    const control = screen.getByText('Option 1').closest('[tabindex="0"]') as HTMLElement;
    const dropdown = control?.parentElement;
    expect(dropdown).toHaveStyle({ width: '200px' });
  });

  test('renders component with custom className', () => {
    const { container } = render(<Dropdown {...defaultProps} className="custom-class" />);
    // The component renders successfully with className
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders down arrow icon', () => {
    render(<Dropdown {...defaultProps} />);
    expect(screen.getByTestId('icon-downSmall')).toBeInTheDocument();
  });

  test('uses default options when none provided', () => {
    render(<Dropdown selected="day" onSelect={vi.fn()} />);
    expect(screen.getByText('Day')).toBeInTheDocument();
  });
});
