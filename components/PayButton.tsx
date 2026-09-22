'use client';
import { useRouter } from 'next/navigation';

export default function PayButton({ price }: { price: string }) {
  const router = useRouter();

  const handlePay = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        router.push('/login');
        return;
    }
    // Implement Razorpay here
  };

  return (
    <button onClick={handlePay} className="w-full bg-[#5D4037] text-white p-4 rounded-xl font-bold hover:bg-[#3E2723] transition-colors">
        Pay ₹{price}
    </button>
  );
}