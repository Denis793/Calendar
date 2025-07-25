import React from 'react';
import { Textarea } from '@/shared/ui/Textarea';
import { Icon } from '@/shared/ui/Icons';
import styles from '../EventForm.module.scss';

export const EventDescriptionSection = ({ description, setDescription }) => {
  return (
    <div className={styles.formRow}>
      <Icon className="icon" name="description" />
      <div className={styles.inputGroup}>
        <label className={styles.label}>Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add description" />
      </div>
    </div>
  );
};
