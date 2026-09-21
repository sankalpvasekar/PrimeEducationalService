'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Upload, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [config, setConfig] = useState({ 
    hero_image_urls: [] as string[], 
    company_info_pdf_urls: [] as string[], 
    preparation_pdf_urls: [] as string[], 
    price: '499' 
  });

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        if (data.hero_image_url) setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async () => {
    setUploading(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) toast.success('Configuration updated!');
      else toast.error('Failed to update');
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><Loader2 className="animate-spin text-[#C5A059]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-serif font-bold text-[#5D4037] flex items-center gap-3">
            <ShieldCheck className="text-[#C5A059]" size={36} /> Site Configuration
        </h1>
        
        <div className="bg-white p-8 rounded-3xl border border-[#C5A059]/20 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-[#5D4037] uppercase">Hero Section</h2>
                    <input className="w-full bg-[#FDFBF7] border border-[#C5A059]/20 rounded-xl px-4 py-3" placeholder="Upload Hero Image" type="file" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-[#5D4037] uppercase">Company Info PDF</h2>
                    <input className="w-full bg-[#FDFBF7] border border-[#C5A059]/20 rounded-xl px-4 py-3" placeholder="Upload Company Info PDF" type="file" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-[#5D4037] uppercase">Preparation PDF</h2>
                    <input className="w-full bg-[#FDFBF7] border border-[#C5A059]/20 rounded-xl px-4 py-3" placeholder="Upload Preparation PDF" type="file" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-[#5D4037] uppercase">Price</h2>
                    <input className="w-full bg-[#FDFBF7] border border-[#C5A059]/20 rounded-xl px-4 py-3" value={config.price} onChange={e => setConfig({...config, price: e.target.value})} />
                </div>
            </div>
            
            <button 
                onClick={handleUpdate}
                disabled={uploading}
                className="w-full bg-[#5D4037] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#3E2723]"
            >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Configuration
            </button>
        </div>
      </div>
    </div>
  );
}
