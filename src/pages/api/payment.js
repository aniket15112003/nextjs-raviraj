import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_fk6tbR96IctJnG',
  key_secret: 'imv2Mnr6dGLvrmB4Sd5AYKLd',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
}
