const Razorpay = require('razorpay');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ Keys missing in .env.local');
    return;
  }

  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    // Attempt to create a tiny order to verify credentials
    const order = await rzp.orders.create({
      amount: 100, // 1 INR
      currency: 'INR',
      receipt: 'test_receipt_001',
    });
    console.log('✅ Connection Successful! Order ID:', order.id);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
  }
}

testConnection();
