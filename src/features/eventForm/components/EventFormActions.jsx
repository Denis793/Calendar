import React from 'react';
import { Button } from '@/shared/ui/Button';
import styles from '../EventForm.module.scss';

export const EventFormActions = () => {
  return (
    <div className={styles.actions}>
      <Button variant="primary" type="submit">
        Save
      </Button>
    </div>
  );
};
