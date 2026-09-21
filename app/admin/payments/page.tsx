'use client';
import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentsAdminPage() {
  const [price, setPrice] = useState('499');
  const handleUpdate = () => { toast.success('Price updated'); };
  
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Payment Configuration</h1>
      <div className="p-6 bg-white border rounded-3xl space-y-4">
        <label className="block font-bold">Product Price (₹)</label>
        <input className="w-full border p-3 rounded-xl" value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={handleUpdate} className="bg-[#5D4037] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
           <Save size={18} /> Update Price
        </button>
      </div>
    </div>
  );
}