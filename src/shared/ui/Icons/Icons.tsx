import React from 'react';
import styles from './Icons.module.scss';
import classNames from 'classnames';
import TriangleIcon from '@/icons/triangle.svg?react';
import Edit from '@/icons/edit.svg?react';
import EyeClose from '@/icons/eyeClose.svg?react';
import EyeOpen from '@/icons/eyeOpen.svg?react';
import Check from '@/icons/check.svg?react';
import ArrowLeft from '@/icons/arrowLeft.svg?react';
import ArrowRight from '@/icons/arrowRight.svg?react';
import DownSmall from '@/icons/downSmall.svg?react';
import Delete from '@/icons/delete.svg?react';
import Description from '@/icons/description.svg?react';
import Close from '@/icons/close.svg?react';
import Logo from '@/icons/logo.svg?react';
import Plus from '@/icons/plus.svg?react';
import Time from '@/icons/time.svg?react';
import Calendar from '@/icons/calendar.svg?react';
import Title from '@/icons/title.svg?react';
import Send from '@/icons/send.svg?react';
import Share from '@/icons/share.svg?react';
import Warning from '@/icons/warning.svg?react';

export type IconName =
  | 'triangle'
  | 'edit'
  | 'eyeClose'
  | 'eyeOpen'
  | 'check'
  | 'arrowLeft'
  | 'arrowRight'
  | 'downSmall'
  | 'delete'
  | 'description'
  | 'close'
  | 'logo'
  | 'plus'
  | 'time'
  | 'calendar'
  | 'title'
  | 'send'
  | 'share'
  | 'warning';

const icons: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
  triangle: TriangleIcon,
  edit: Edit,
  eyeClose: EyeClose,
  eyeOpen: EyeOpen,
  check: Check,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  downSmall: DownSmall,
  delete: Delete,
  description: Description,
  close: Close,
  logo: Logo,
  plus: Plus,
  time: Time,
  calendar: Calendar,
  title: Title,
  send: Send,
  share: Share,
  warning: Warning,
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name?: IconName;
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
  title?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 16, style, ...props }) => {
  if (!name) {
    return (
      <>
        {(Object.entries(icons) as [IconName, React.FC<React.SVGProps<SVGSVGElement>>][]).map(([iconName]) => (
          <div key={iconName}>
            <Icon
              name={iconName}
              className={classNames(styles.icon, className)}
              size={size}
              style={style}
              data-testid={`icon-${iconName}`}
              {...props}
            />
            <div>{iconName}</div>
          </div>
        ))}
      </>
    );
  }

  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }

  return (
    <IconComponent
      className={classNames(styles.icon, className)}
      width={size}
      height={size}
      style={style}
      data-testid="icon"
      {...props}
    />
  );
};
