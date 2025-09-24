import React from 'react';
import styles from './Icons.module.scss';
import classNames from 'classnames';
import TriangleIcon from '@/img/icons/triangle.svg?react';
import Edit from '@/img/icons/edit.svg?react';
import EyeClose from '@/img/icons/eyeClose.svg?react';
import EyeOpen from '@/img/icons/eyeOpen.svg?react';
import Check from '@/img/icons/check.svg?react';
import ArrowLeft from '@/img/icons/arrowLeft.svg?react';
import ArrowRight from '@/img/icons/arrowRight.svg?react';
import DownSmall from '@/img/icons/downSmall.svg?react';
import Delete from '@/img/icons/delete.svg?react';
import Description from '@/img/icons/description.svg?react';
import Close from '@/img/icons/close.svg?react';
import Logo from '@/img/icons/logo.svg?react';
import Plus from '@/img/icons/plus.svg?react';
import Time from '@/img/icons/time.svg?react';
import Calendar from '@/img/icons/calendar.svg?react';
import Title from '@/img/icons/title.svg?react';
import Send from '@/img/icons/send.svg?react';
import Share from '@/img/icons/share.svg?react';
import Warning from '@/img/icons/warning.svg?react';

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
