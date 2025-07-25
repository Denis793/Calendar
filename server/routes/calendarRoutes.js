import express from 'express';
import {
  getCalendars,
  getCalendar,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  toggleVisibility,
  shareCalendar,
  createDefaultCalendar,
} from '../controllers/calendarController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);
router.route('/').get(getCalendars).post(createCalendar);
router.post('/create-default', createDefaultCalendar);
router.route('/:id').get(getCalendar).put(updateCalendar).delete(deleteCalendar);
router.patch('/:id/visibility', toggleVisibility);
router.post('/:id/share', protect, shareCalendar);

export default router;
