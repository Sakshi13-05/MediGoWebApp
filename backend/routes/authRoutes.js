import express from 'express';
import { requestOTP, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

// This creates the /api/auth/send-otp endpoint
router.post('/send-otp', requestOTP);

// This creates the /api/auth/verify-otp endpoint
router.post('/verify-otp', verifyOTP);

export default router;