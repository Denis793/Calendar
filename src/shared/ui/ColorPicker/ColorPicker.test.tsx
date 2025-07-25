import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ColorPicker from './ColorPicker';

const mockColors = [
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
];

describe('ColorPicker', () => {
  it('renders with default colors', () => {
    const onColorSelect = vi.fn();

    render(<ColorPicker selectedColor="#9F2957" onColorSelect={onColorSelect} />);

    expect(screen.getByTestId('color-picker-container')).toBeInTheDocument();
    expect(screen.getByTestId('color-panel')).toBeInTheDocument();
    expect(screen.getByText('Color Picker')).toBeInTheDocument();

    // Should render default colors (12 colors)
    const colorButtons = screen.getAllByTestId(/color-button-\d+/);
    expect(colorButtons).toHaveLength(12);
  });

  it('renders with custom colors', () => {
    const onColorSelect = vi.fn();

    render(<ColorPicker selectedColor="#ff0000" onColorSelect={onColorSelect} colors={mockColors} />);

    const colorButtons = screen.getAllByTestId(/color-button-\d+/);
    expect(colorButtons).toHaveLength(3);

    expect(screen.getByTestId('color-button-0')).toHaveAttribute('data-color', '#ff0000');
    expect(screen.getByTestId('color-button-1')).toHaveAttribute('data-color', '#00ff00');
    expect(screen.getByTestId('color-button-2')).toHaveAttribute('data-color', '#0000ff');
  });

  it('shows selected color correctly', () => {
    const onColorSelect = vi.fn();

    render(<ColorPicker selectedColor="#00ff00" onColorSelect={onColorSelect} colors={mockColors} />);

    const greenButton = screen.getByTestId('color-button-1');
    expect(greenButton.className).toContain('selected');

    const redButton = screen.getByTestId('color-button-0');
    expect(redButton.className).not.toContain('selected');
  });

  it('calls onColorSelect when color is clicked', () => {
    const onColorSelect = vi.fn();

    render(<ColorPicker selectedColor="#ff0000" onColorSelect={onColorSelect} colors={mockColors} />);

    const blueButton = screen.getByTestId('color-button-2');
    fireEvent.click(blueButton);

    expect(onColorSelect).toHaveBeenCalledWith('#0000ff');
    expect(onColorSelect).toHaveBeenCalledTimes(1);
  });

  it('does not crash when onColorSelect is not provided', () => {
    render(<ColorPicker selectedColor="#ff0000" colors={mockColors} />);

    const redButton = screen.getByTestId('color-button-0');
    expect(() => fireEvent.click(redButton)).not.toThrow();
  });

  it('sets correct background color for buttons', () => {
    const onColorSelect = vi.fn();

    render(<ColorPicker selectedColor="#ff0000" onColorSelect={onColorSelect} colors={mockColors} />);

    const redButton = screen.getByTestId('color-button-0');
    const greenButton = screen.getByTestId('color-button-1');
    const blueButton = screen.getByTestId('color-button-2');

    expect(redButton).toHaveStyle({ backgroundColor: '#ff0000' });
    expect(greenButton).toHaveStyle({ backgroundColor: '#00ff00' });
    expect(blueButton).toHaveStyle({ backgroundColor: '#0000ff' });
  });

  it('sets correct title for buttons', () => {
    const onColorSelect = vi.fn();

    render(<ColorPicker selectedColor="#ff0000" onColorSelect={onColorSelect} colors={mockColors} />);

    const redButton = screen.getByTestId('color-button-0');
    const greenButton = screen.getByTestId('color-button-1');
    const blueButton = screen.getByTestId('color-button-2');

    expect(redButton).toHaveAttribute('title', 'Red');
    expect(greenButton).toHaveAttribute('title', 'Green');
    expect(blueButton).toHaveAttribute('title', 'Blue');
  });

  it('handles empty colors array', () => {
    const onColorSelect = vi.fn();

    render(<ColorPicker selectedColor="#ff0000" onColorSelect={onColorSelect} colors={[]} />);

    const colorButtons = screen.queryAllByTestId(/color-button-\d+/);
    expect(colorButtons).toHaveLength(0);
  });
});
