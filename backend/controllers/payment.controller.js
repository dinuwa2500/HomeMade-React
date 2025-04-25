import Payment from '../models/payment.model.js';

// User uploads payment slip
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

// Admin: view all payment slips
export const getAllPayments = async (req, res) => {
  try {
    console.log('DEBUG: Starting getAllPayments');
    const count = await Payment.countDocuments();
    console.log('DEBUG: Total payments in DB:', count);
    
    // If no payments exist, create a test payment
    if (count === 0) {
      console.log('DEBUG: Creating test payment');
      const testPayment = new Payment({
        orderId: 'TEST-ORDER-123',
        userId: req.user._id, // Use the admin's ID
        slipUrl: 'https://via.placeholder.com/150',
        status: 'pending',
        adminNote: 'Test payment created automatically'
      });
      await testPayment.save();
      console.log('DEBUG: Test payment created');
    }
    
    // Try to get raw documents without population
    const rawDocs = await Payment.find().lean();
    console.log('DEBUG: Raw payment docs:', JSON.stringify(rawDocs));
    
    // Now try with population
    const payments = await Payment.find().populate('userId', 'email').sort({ createdAt: -1 });
    console.log('DEBUG: Populated payments:', JSON.stringify(payments));
    
    res.json({ success: true, payments });
  } catch (err) {
    console.error('DEBUG: getAllPayments error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: approve or reject payment slip
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
