import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

const Payment = () => {
  const router = useRouter();

  const [seminarData, setSeminarData] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [requestRegisterId, setRequestRegisterId] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Get ID from sessionStorage instead of router.query
  useEffect(() => {
    const storedId = sessionStorage.getItem('requestRegisterId');
    if (!storedId) {
      alert('No registration ID found. Please register again.');
      return;
    }
    setRequestRegisterId(storedId);
  }, []);

  // Fetch seminar/payment data using the ID
  useEffect(() => {
    if (!requestRegisterId) return;

    fetch(`${API_BASE_URL}/seminar/payment/${requestRegisterId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSeminarData(data);
        } else {
          alert(data.message || 'Seminar not found.');
        }
      })
      .catch((err) => {
        console.error('Error fetching seminar data:', err);
        alert('Failed to fetch seminar data.');
      });
  }, [requestRegisterId]);

  // Trigger payment once everything is ready
  useEffect(() => {
    if (razorpayLoaded && seminarData) {
      handlePayment();
    }
  }, [razorpayLoaded, seminarData]);

  const handlePayment = async () => {
    try {
      const amountInRupees = seminarData.amount;
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInRupees }),
      });

      const order = await res.json();

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Seminar Registration',
        description: 'Payment for Seminar',
        order_id: order.id,
        handler: async (response) => {
          // ✅ Payment success logic
          const paymentDetails = {
            request_register_id: requestRegisterId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: seminarData.amount,
            description: 'Payment for Seminar Registration',
          };
          try {
            const res = await fetch(`${API_BASE_URL}/payment/save`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paymentDetails),
            });

            const result = await res.json();
            if (result.success) {
              // Save to sessionStorage
              sessionStorage.setItem('payment', JSON.stringify(result.data.payment));
              sessionStorage.setItem('register', JSON.stringify(result.data.register));

              router.push('/receipt/receipt');
            }
            else {
              alert('Payment save failed: ' + result.error);
            }
          } catch (err) {
            console.error('Error saving payment:', err);
            alert('Failed to save payment on server.');
          }
        },
        prefill: {
          name: seminarData.user?.name || '',
          email: seminarData.user?.email || '',
          contact: seminarData.user?.phone || '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment popup closed without completing payment.');
            router.push('/'); // ✅ Redirect to index on cancel
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong during payment.');
    }
  };

  return <div>{!seminarData ? 'Loading seminar details...' : 'Processing Payment...'}</div>;
};

export default Payment;
