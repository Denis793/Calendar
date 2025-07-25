import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

export function getRepeatDates(startDate, repeatType, count = 10) {
  const dates = [];
  let current = new Date(startDate);
  for (let i = 0; i < count; i++) {
    dates.push(new Date(current));
    switch (repeatType) {
      case 'daily':
        current = addDays(current, 1);
        break;
      case 'weekly':
        current = addWeeks(current, 1);
        break;
      case 'monthly':
        current = addMonths(current, 1);
        break;
      case 'yearly':
        current = addYears(current, 1);
        break;
      default:
        return [startDate];
    }
  }
  return dates;
}
