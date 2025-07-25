import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  moveEvent,
  duplicateEvent,
} from '../controllers/eventController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);
router.route('/').get(getEvents).post(createEvent);
router.route('/:id').get(getEvent).put(updateEvent).delete(deleteEvent);
router.patch('/:id/move', moveEvent);
router.post('/:id/duplicate', duplicateEvent);

export default router;
