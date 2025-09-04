import express from 'express';
import {
  register,
  signin,
  updatePassword,
  deleteUser,
  getUsers,
  getUserProfile,
} from '../controllers/userController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';
import { validateRegistration, validateLogin } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/signin', validateLogin, signin);
router.put('/password', verifyToken, updatePassword);
router.delete('/user/:userId', verifyToken, adminOnly, deleteUser);
router.get('/users', verifyToken, adminOnly, getUsers);
router.get ('/profile', verifyToken, getUserProfile);
export default router;
