'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [config, setConfig] = useState({ hero_image_url: '', company_info_pdf_url: '', preparation_pdf_url: '', price: '499' });
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/config')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      })
      .then(data => { 
        if (Object.keys(data).length > 0) setConfig(data);
        setLoading(false); 
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 font-sans">
        <main className="max-w-xl mx-auto space-y-8">
            {config.hero_image_url && <Image src={config.hero_image_url} alt="Hero" width={600} height={300} className="rounded-3xl" />}
            
            {hasPaid ? (
                <div className="space-y-4">
                    <a href={config.company_info_pdf_url} className="block w-full text-center bg-[#5D4037] text-white p-4 rounded-xl font-bold">Company Information</a>
                    <a href={config.preparation_pdf_url} className="block w-full text-center bg-[#C5A059] text-white p-4 rounded-xl font-bold">Preparation Material</a>
                </div>
            ) : (
                <button className="w-full bg-[#5D4037] text-white p-4 rounded-xl font-bold">Pay ₹{config.price}</button>
            )}
        </main>
    </div>
  );
}
