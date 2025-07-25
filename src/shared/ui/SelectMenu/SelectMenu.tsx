import React, { useState, useRef } from 'react';
import { Icon } from '@/shared/ui/Icons';
import styles from './SelectMenu.module.scss';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import classNames from 'classnames';
import { SelectOption } from '@/types';

interface SelectMenuProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  width?: number;
  isOptionDisabled?: (option: SelectOption) => boolean;
  id?: string;
  'data-testid'?: string;
}

export const SelectMenu: React.FC<SelectMenuProps> = ({
  options,
  value,
  onChange,
  label,
  className,
  width = 120,
  isOptionDisabled,
  id,
  'data-testid': testId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

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
    onChange?.(optionValue);
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
      <div className={styles.selectMenu} ref={ref} style={{ width }}>
        <div
          className={classNames(styles.control, { [styles.pressed]: open })}
          tabIndex={0}
          role="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={label || 'Select Menu'}
          onClick={handleToggleOpen}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.selectedOption}>{selectedOption ? selectedOption.label : 'Select...'}</span>
          <Icon name="downSmall" />
        </div>

        {open && (
          <ul className={styles.menu} role="listbox">
            {options.map((opt, idx) => {
              const disabled = isOptionDisabled?.(opt) || false;

              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  aria-disabled={disabled}
                  className={classNames(styles.item, {
                    [styles.hoveredItem]: idx === hoveredIdx && !disabled,
                    [styles.selectedItem]: opt.value === value,
                    [styles.disabledItem]: disabled,
                  })}
                  onMouseEnter={() => !disabled && handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => !disabled && handleOptionClick(opt.value)}
                  style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
