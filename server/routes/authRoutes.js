import express from 'express';
import { register, login, getMe, updateProfile, updatePassword, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(protect);

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/updatepassword', updatePassword);
router.get('/logout', logout);

export default router;
