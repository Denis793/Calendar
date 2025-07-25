import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';
import { Icon } from '../Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  withIcon?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  withIcon = false,
  className,
  ...props
}) => {
  return (
    <button className={classNames(styles.button, styles[variant], className)} disabled={disabled} {...props}>
      {withIcon && <Icon className="icon" name="triangle" role="img" style={{}} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
