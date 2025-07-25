import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Link from './Link.tsx';

describe('Link component', () => {
  test('renders with base class and text', () => {
    const handleClick = vi.fn();
    render(<Link onClick={handleClick}>Test Link</Link>);
    const link = screen.getByRole('link', { name: 'Test Link' });

    expect(link).toBeInTheDocument();
    expect(link.className).toContain('link');
    expect(link).toHaveAttribute('href', '#');
  });

  test('has href and is available if not disabled', () => {
    const handleClick = vi.fn();
    render(
      <Link disabled={false} onClick={handleClick}>
        Active Link
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Active Link' });

    expect(link).toHaveAttribute('href', '#');
    expect(link).toHaveAttribute('aria-disabled', 'false');
  });

  test('does not have href, tabindex=-1 and aria-disabled if disabled', () => {
    const handleClick = vi.fn();
    render(
      <Link disabled={true} onClick={handleClick}>
        Disabled Link
      </Link>
    );
    const link = screen.getByText('Disabled Link');

    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link.className).toContain('disabled');
  });

  test('adds a custom class if passed', () => {
    const handleClick = vi.fn();
    render(
      <Link className="custom-class" onClick={handleClick}>
        Styled Link
      </Link>
    );
    const link = screen.getByText('Styled Link');

    expect(link.className).toContain('custom-class');
  });

  test('onClick works if not disabled', () => {
    const handleClick = vi.fn();
    render(<Link onClick={handleClick}>Clickable</Link>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalled();
  });

  test('onClick is not called if disabled', () => {
    const handleClick = vi.fn();
    render(
      <Link onClick={handleClick} disabled>
        Not Clickable
      </Link>
    );
    fireEvent.click(screen.getByText('Not Clickable'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
