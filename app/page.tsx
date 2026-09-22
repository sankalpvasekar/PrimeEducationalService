import { query } from '@/lib/db';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import PayButton from '@/components/PayButton'; // We will create this

async function getAdminData() {
  const configs = await query<any>('SELECT * FROM admins_data LIMIT 1');
  return configs[0] || { hero_images: [], company_pdfs: [], preparation_pdfs: [], price: '499' };
}

async function checkPurchaseStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return false;
  
  const payload = verifyToken(token);
  if (!payload) return false;

  const users = await query<{ payment_done: boolean }>('SELECT payment_done FROM users WHERE id = $1', [payload.userId]);
  return users.length > 0 && users[0].payment_done;
}

export default async function HomePage() {
  const config = await getAdminData();
  const hasPaid = await checkPurchaseStatus();
  
  // Safely cast or default the price
  const priceDisplay = config.price ? String(config.price) : '499';

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-6 font-sans">
        <main className="max-w-xl mx-auto space-y-6">
            {/* Hero Section */}
            {config.hero_images && (config.hero_images as string[]).map((url, i) => (
                url && url.trim() !== '' ? (
                    <div key={i} className="relative w-full">
                        <Image 
                            src={url} 
                            alt={`Hero ${i}`} 
                            width={1100} 
                            height={600} 
                            className="w-full h-auto rounded-3xl object-contain shadow-md"
                            sizes="(max-width: 768px) 94vw, 1100px"
                            priority
                        />
                    </div>
                ) : null
            ))}
            
            {/* Material / Payment Section */}
            {hasPaid ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#5D4037]">Access Material</h2>
                    {(config.company_pdfs as any[]).map((pdf, i) => (
                        <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#5D4037] text-white p-4 rounded-xl font-bold hover:bg-[#3E2723] transition-colors">
                            Company Info: {pdf.title}
                        </a>
                    ))}
                    {(config.preparation_pdfs as any[]).map((pdf, i) => (
                        <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#C5A059] text-white p-4 rounded-xl font-bold hover:bg-[#A1887F] transition-colors">
                            Preparation: {pdf.title}
                        </a>
                    ))}
                </div>
            ) : (
                <PayButton price={priceDisplay} />
            )}
        </main>
    </div>
  );
}