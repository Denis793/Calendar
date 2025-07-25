import React, { ReactNode, MouseEvent } from 'react';
import styles from './Link.module.scss';

interface LinkProps {
  className?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
  [key: string]: any;
}

export const Link: React.FC<LinkProps> = ({ className = '', disabled = false, onClick, children, ...props }) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <a
      className={`${styles.link} ${disabled ? styles.disabled : ''} ${className}`}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      href={disabled ? undefined : '#'}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
