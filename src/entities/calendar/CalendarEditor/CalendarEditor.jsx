import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ColorPicker } from '@/shared/ui/ColorPicker';
import { useModalStore } from '@/shared/hooks/useModal';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import styles from './CalendarEditor.module.scss';

const { DEFAULT_CALENDAR_DATA } = CALENDAR_CONSTANTS;

export const CalendarEditor = ({ initialData = {}, onSubmit, submitButtonText = 'Save', mode = 'edit' }) => {
  const { isOpen, closeModal } = useModalStore();
  const [formData, setFormData] = useState({
    ...DEFAULT_CALENDAR_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      ...DEFAULT_CALENDAR_DATA,
      ...initialData,
    });
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Calendar name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Calendar name must be at least 2 characters';
    }

    if (!formData.color) {
      newErrors.color = 'Calendar color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      name: formData.name.trim(),
    };

    onSubmit(submissionData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Calendar';
      case 'edit':
        return initialData.id ? 'Edit Calendar' : 'Add Calendar';
      default:
        return 'Calendar';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'create':
        return 'Create Calendar';
      case 'edit':
        return initialData.id ? 'Update Calendar' : 'Create Calendar';
      default:
        return submitButtonText;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title={getModalTitle()}>
      <form onSubmit={handleSubmit} className={styles.calendarForm}>
        <div className={styles.formGroup}>
          <Input
            label="Calendar Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter calendar name"
            autoFocus
          />
        </div>

        <div className={styles.formGroup}>
          <ColorPicker
            label="Calendar Color"
            value={formData.color}
            onChange={(color) => handleInputChange('color', color)}
            error={errors.color}
          />
        </div>

        {mode === 'create' && (
          <div className={styles.createInfo}>
            <p className={styles.infoText}>Create a new calendar to organize your events by category or purpose.</p>
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="button" variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {getSubmitButtonText()}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
