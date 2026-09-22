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
    // 1. Fetch Config
    const fetchConfig = async () => {
        const cached = sessionStorage.getItem('siteConfig');
        if (cached) {
            setConfig(JSON.parse(cached));
        } else {
            const res = await fetch('/api/admin/config');
            if (res.ok) {
                const data = await res.json();
                if (Object.keys(data).length > 0) {
                    setConfig(data);
                    sessionStorage.setItem('siteConfig', JSON.stringify(data));
                }
            }
        }
    };

    // 2. Fetch Payment Status
    const fetchPurchaseStatus = async () => {
        const res = await fetch('/api/check-purchase');
        if (res.ok) {
            const data = await res.json();
            setHasPaid(data.hasPaid);
        }
        setLoading(false);
    };

    fetchConfig();
    fetchPurchaseStatus();
  }, []);

  const router = useRouter();

  const handlePay = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        router.push('/login');
        return;
    }
    // Proceed to payment integration
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 font-sans">
        <main className="max-w-xl mx-auto space-y-8">
            {config.hero_image_urls && config.hero_image_urls.map((url, i) => (
                <Image key={i} src={url} alt="Hero" width={600} height={300} className="rounded-3xl" />
            ))}
            
            {hasPaid ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Access Material</h2>
                    {config.company_pdfs && config.company_pdfs.map((pdf: any, i: number) => (
                        <a key={i} href={pdf.url} className="block w-full text-center bg-[#5D4037] text-white p-4 rounded-xl font-bold">Company Info: {pdf.title}</a>
                    ))}
                    {config.preparation_pdfs && config.preparation_pdfs.map((pdf: any, i: number) => (
                        <a key={i} href={pdf.url} className="block w-full text-center bg-[#C5A059] text-white p-4 rounded-xl font-bold">Preparation: {pdf.title}</a>
                    ))}
                </div>
            ) : (
                <button onClick={handlePay} className="w-full bg-[#5D4037] text-white p-4 rounded-xl font-bold">Pay ₹{config.price}</button>
            )}
        </main>
    </div>
  );
}
