import React from 'react';
import { Input } from '@/shared/ui/Input';
import { Icon } from '@/shared/ui/Icons';
import styles from '../EventForm.module.scss';

export const EventDetailsSection = ({ title, setTitle }) => {
  return (
    <div className={styles.formRow}>
      <Icon className="icon" name="title" />
      <div className={styles.inputGroup}>
        <label className={styles.label}>Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add title" />
      </div>
    </div>
  );
};
