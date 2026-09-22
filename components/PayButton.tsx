'use client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PayButton({ price }: { price: string }) {
  const router = useRouter();

  const handlePay = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        router.push('/login');
        return;
    }
    
    // 1. Create Order
    const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-order' })
    });
    const data = await res.json();
    if (!data.success) {
        toast.error('Failed to initiate payment');
        return;
    }

    // 2. Open Razorpay
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Prime Educational Services',
        order_id: data.order.id,
        handler: async (response: any) => {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                })
            });
            if ((await verifyRes.json()).success) {
                toast.success('Payment successful!');
                router.refresh(); // Refresh page to show material
            } else {
                toast.error('Payment verification failed');
            }
        },
        theme: { color: '#5D4037' }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <button onClick={handlePay} className="w-full bg-[#5D4037] text-white p-4 rounded-xl font-bold hover:bg-[#3E2723] transition-colors">
          Pay ₹{price}
      </button>
    </>
  );
}