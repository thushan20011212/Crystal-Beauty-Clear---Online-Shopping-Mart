import express from 'express';
import {
  createUser,
  loginUser,
  loginWithGoogle,
  sendOTP,
  resetPassword,
  getUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';

const userRouter = express.Router();

// Public Routes
userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/login/google', loginWithGoogle);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/reset-password', resetPassword);

// Authenticated Routes
userRouter.get('/', getUser);

// Admin Routes
userRouter.get('/admin/all', getAllUsers);
userRouter.put('/admin/:userId/role', updateUserRole);
userRouter.delete('/admin/:userId', deleteUser);

export default userRouter;