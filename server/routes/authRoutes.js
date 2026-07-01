import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateSignup } from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', validateSignup, registerUser);
router.post('/login', authLimiter, authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get('/users', protect, admin, getUsers);

export default router;
