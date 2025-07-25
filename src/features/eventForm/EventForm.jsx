import React from 'react';
import { Formik, Form } from 'formik';
import { eventSchema } from './eventSchema';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { DatePicker } from '@/shared/ui/DatePicker';
import { ColorPicker } from '@/shared/ui/ColorPicker';
import { useEventFormLogic } from '@/shared/hooks/useEventFormLogic';
import { EventFormActions } from './components/EventFormActions';
import { EventDetailsSection } from './components/EventDetailsSection';
import { EventScheduleSection } from './components/EventScheduleSection';
import { EventCalendarColorSection } from './components/EventCalendarColorSection';
import { EventDescriptionSection } from './components/EventDescriptionSection';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import styles from './EventForm.module.scss';

const { DEFAULT_EVENT_COLOR } = CALENDAR_CONSTANTS;

export const EventForm = (props) => {
  console.log('EventForm props:', props);

  const logic = useEventFormLogic({
    ...props,
    color: props.color || DEFAULT_EVENT_COLOR,
  });

  console.log('EventForm logic.initialValues:', logic.initialValues);

  return (
    <Formik
      initialValues={{
        ...logic.initialValues,
        color: logic.initialValues.color || DEFAULT_EVENT_COLOR,
      }}
      validationSchema={eventSchema}
      onSubmit={logic.handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form className={styles.form}>
          <EventDetailsSection {...logic.getDetailsSectionProps({ values, errors, touched, setFieldValue })} />
          <EventScheduleSection {...logic.getScheduleSectionProps({ values, errors, touched, setFieldValue })} />
          <EventCalendarColorSection
            {...logic.getCalendarColorSectionProps({ values, errors, touched, setFieldValue })}
          />
          <EventDescriptionSection {...logic.getDescriptionSectionProps({ values, setFieldValue })} />
          <EventFormActions isSubmitting={isSubmitting} />

          <Modal
            key="color-picker-modal"
            isOpen={logic.isColorPickerModalOpen}
            onClose={logic.closeColorPickerModal}
            title="Select Event Color"
          >
            <ColorPicker
              selectedColor={values.color || DEFAULT_EVENT_COLOR}
              onColorSelect={logic.handleColorChange(setFieldValue)}
              onClose={logic.closeColorPickerModal}
            />
          </Modal>

          <Modal
            key="date-picker-modal"
            isOpen={logic.isDatePickerModalOpen}
            onClose={logic.closeDatePickerModal}
            title="Select Event Date"
            size="medium"
          >
            <DatePicker
              selectedDate={values.date}
              onDateChange={logic.handleDateSelect(setFieldValue)}
              occupiedDates={logic.getOccupiedDates(values.calendarId)}
            />
          </Modal>
        </Form>
      )}
    </Formik>
  );
};
