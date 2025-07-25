import * as yup from 'yup';

export const eventSchema = yup.object().shape({
  title: yup.string().trim().required('Event title is required'),
  date: yup.date().required('Date is required').typeError('Date is required'),
  startTime: yup
    .string()
    .required('Start time is required')
    .matches(/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'),
  endTime: yup
    .string()
    .required('End time is required')
    .matches(/^\d{2}:\d{2}$/, 'End time must be in HH:mm format')
    .test('is-after', 'End time must be after start time', function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = value.split(':').map(Number);
      return eh * 60 + em > sh * 60 + sm;
    }),
  calendarId: yup.string().required('Calendar is required'),
  description: yup.string().max(1000, 'Description is too long'),
  color: yup
    .string()
    .matches(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Color must be a valid hex code')
    .nullable(),
  allDay: yup.boolean(),
  repeat: yup.string(),
});
