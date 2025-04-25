import express from 'express';
import { uploadPaymentSlip, getAllPayments, updatePaymentStatus } from '../controllers/payment.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = express.Router();

// User uploads payment slip
router.post('/upload', requireAuth, uploadPaymentSlip);
// Admin views all payments
router.get('/all', requireAuth, requireAdmin, getAllPayments);
// Admin approves/rejects
router.patch('/:paymentId', requireAuth, requireAdmin, updatePaymentStatus);

export default router;
