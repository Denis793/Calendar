import React, { useState, useRef } from 'react';
import { Icon } from '@/shared/ui/Icons';
import styles from './Dropdown.module.scss';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import classNames from 'classnames';
import { DropdownOption } from '@/types';

interface DropdownProps {
  options?: DropdownOption[];
  selected: string;
  onSelect: (value: string) => void;
  width?: number;
  label?: string;
  className?: string;
  id?: string;
  'data-testid'?: string;
}

const DEFAULT_OPTIONS: DropdownOption[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
];

export const Dropdown: React.FC<DropdownProps> = ({
  options = DEFAULT_OPTIONS,
  selected,
  onSelect,
  width = 120,
  label,
  className,
  id,
  'data-testid': testId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === selected);

  useClickOutside(ref, () => setOpen(false));

  const handleToggleOpen = (): void => {
    setOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleOpen();
    }
  };

  const handleOptionClick = (optionValue: string): void => {
    onSelect?.(optionValue);
    setOpen(false);
  };

  const handleMouseEnter = (idx: number): void => {
    setHoveredIdx(idx);
  };

  const handleMouseLeave = (): void => {
    setHoveredIdx(-1);
  };

  return (
    <div className={classNames(styles.wrapper, className)} id={id} data-testid={testId}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.dropdown} ref={ref} style={{ width }}>
        <div
          className={classNames(styles.control, { [styles.pressed]: open })}
          tabIndex={0}
          role="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={label || 'Dropdown'}
          onClick={handleToggleOpen}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.dropdownDescription}>{selectedOption ? selectedOption.label : 'Select...'}</span>
          <Icon name="downSmall" />
        </div>

        {open && (
          <ul className={styles.menu} role="listbox">
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === selected}
                className={classNames(styles.item, {
                  [styles.hoveredItem]: idx === hoveredIdx,
                  [styles.selectedItem]: opt.value === selected,
                })}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleOptionClick(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
