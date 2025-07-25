import React, { forwardRef } from 'react';
import styles from './Textarea.module.scss';
import classNames from 'classnames';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id?: string;
  name?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hasError?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      id,
      name,
      value,
      onChange,
      placeholder,
      rows = 4,
      disabled = false,
      required = false,
      error = '',
      hasError = false,
      className,
      'data-testid': testId,
      ...rest
    },
    ref
  ) => (
    <div className={classNames(styles.textareaGroup, className)} data-testid={testId}>
      {label && (
        <label
          htmlFor={id}
          className={classNames(styles.label, {
            [styles.required]: required,
            [styles.disabledLabel]: disabled,
          })}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        className={classNames(styles.textarea, {
          [styles.error]: hasError,
        })}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        ref={ref}
        {...rest}
      />
      {hasError && error && <div className={styles.errorMsg}>{error}</div>}
    </div>
  )
);

Textarea.displayName = 'Textarea';
