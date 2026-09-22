'use client';
import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ 
    hero_images: [], 
    company_pdfs: [], 
    preparation_pdfs: [], 
    price: '499' 
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) toast.success('Price updated');
      else toast.error('Failed to update');
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Payment Configuration</h1>
      <div className="p-6 bg-white border rounded-3xl space-y-4">
        <label className="block font-bold">Product Price (₹)</label>
        <input 
            className="w-full border p-3 rounded-xl" 
            value={config.price} 
            onChange={e => setConfig({...config, price: e.target.value})} 
        />
        <button onClick={handleUpdate} disabled={saving} className="bg-[#5D4037] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
           {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Update Price
        </button>
      </div>
    </div>
  );
}