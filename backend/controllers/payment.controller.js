import Payment from '../models/payment.model.js';

export const uploadPaymentSlip = async (req, res) => {
  try {
    const { orderId, userId, slipUrl } = req.body;
    if (!orderId || !userId || !slipUrl) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const payment = new Payment({ orderId, userId, slipUrl });
    await payment.save();
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const count = await Payment.countDocuments();
    
    if (count === 0) {
      const testPayment = new Payment({
        orderId: 'TEST-ORDER-123',
        userId: req.user._id, 
        slipUrl: 'https://via.placeholder.com/150',
        status: 'pending',
        adminNote: 'Test payment created automatically'
      });
      await testPayment.save();
    }
    
    const rawDocs = await Payment.find().lean();
    
    const payments = await Payment.find().populate('userId', 'email').sort({ createdAt: -1 });
    
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const payment = await Payment.findByIdAndUpdate(paymentId, { status, adminNote }, { new: true });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
