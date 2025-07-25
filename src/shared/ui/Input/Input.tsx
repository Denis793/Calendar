import React, { useState, forwardRef, useId } from 'react';
import { Icon } from '@/shared/ui/Icons';
import styles from './Input.module.scss';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  hasError?: boolean;
  disabled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      name,
      type = 'text',
      placeholder,
      value,
      onChange,
      error,
      required = false,
      hasError = false,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const generatedId = useId();
    const inputId = id || generatedId;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setShowPassword((prev) => !prev);
      }
    };

    return (
      <div className={styles.formGroup}>
        {label && (
          <label
            className={`${styles.label} ${required ? styles.required : ''} ${disabled ? styles.disabledLabel : ''}`}
            htmlFor={inputId}
          >
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          <input
            className={`${styles.input} ${hasError ? styles.errorBorder : ''}`}
            type={inputType}
            id={inputId}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            autoComplete={isPassword ? 'new-password' : undefined}
            ref={ref}
            {...rest}
          />
          {isPassword && (
            <span
              className={styles.togglePassword}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onKeyDown={handleKeyDown}
            >
              <Icon name={showPassword ? 'eyeOpen' : 'eyeClose'} className={styles.eye} style={{}} />
            </span>
          )}
        </div>

        <div className={styles.error}>{hasError && error}</div>
      </div>
    );
  }
);

Input.displayName = 'FormInput';

interface UsernamePasswordInputsProps {
  usernameProps?: InputProps;
  passwordProps?: InputProps;
}

export function UsernamePasswordInputs({ usernameProps = {}, passwordProps = {} }: UsernamePasswordInputsProps) {
  return (
    <div className={styles.inputWrapper}>
      <Input label="Username" name="username" placeholder="Enter username" {...usernameProps} />
      <Input label="Password" name="password" type="password" placeholder="Enter password" {...passwordProps} />
    </div>
  );
}
