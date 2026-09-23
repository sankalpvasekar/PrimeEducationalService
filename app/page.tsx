import { query } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

async function getAdminData() {
  const configs = await query<any>('SELECT * FROM admins_data LIMIT 1');
  return configs[0] || { hero_images: [], price: '499', highlight_text: '500+ Companies Trusted Us' };
}

export default async function HomePage() {
  const config = await getAdminData();

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-6 font-sans">
        <main className="max-w-xl mx-auto space-y-6 text-center">
            {/* Highlight Section */}
            <div className="p-8 bg-white border border-[#C5A059]/20 rounded-3xl shadow-sm">
                <h1 className="text-3xl font-extrabold text-[#5D4037] mb-6 leading-tight">
                    {config.highlight_text}
                </h1>
                <Link href="/main" className="inline-block bg-[#2E7D32] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1B5E20] transition-colors shadow-lg">
                    Click Here
                </Link>
            </div>
        </main>
    </div>
  );
}