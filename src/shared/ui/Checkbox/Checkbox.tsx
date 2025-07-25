import React, { forwardRef, useId } from 'react';
import { Icon } from '@/shared/ui/Icons/Icons';
import styles from './Checkbox.module.scss';
import classNames from 'classnames';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  calendarColor?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, id, name = 'agreeToTerms', disabled = false, calendarColor, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || `checkbox-${autoId}`;

    return (
      <div
        className={classNames(styles.checkboxGroup, {
          [styles.disabled]: disabled,
        })}
        style={
          {
            '--checkbox-color': calendarColor || 'var(--primary-btn-default-bg)',
            '--checkbox-border-color': calendarColor || 'var(--border-color)',
          } as React.CSSProperties
        }
        data-testid="checkbox-container"
      >
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          ref={ref}
          data-testid="checkbox-input"
          {...props}
        />
        <label htmlFor={inputId} className={styles.checkbox} data-testid="checkbox-label">
          <Icon name="check" className={styles.checkboxIcon} />
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
