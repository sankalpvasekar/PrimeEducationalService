import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { redirect } from 'next/navigation';

async function getAdminData() {
  const configs = await query<any>('SELECT * FROM admins_data LIMIT 1');
  return configs[0] || { company_pdfs: [], preparation_pdfs: [] };
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) redirect('/login');
  
  const payload = verifyToken(token);
  if (!payload) redirect('/login');

  const config = await getAdminData();

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 font-sans">
        <main className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-[#5D4037]">Student Dashboard</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-[#C5A059]/20 shadow-sm space-y-4">
                    <h2 className="text-xl font-bold text-[#5D4037]">Company Information</h2>
                    {(config.company_pdfs as any[]).map((pdf, i) => (
                        <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#FDFBF7] border border-[#C5A059]/20 p-4 rounded-xl font-bold hover:border-[#C5A059] transition-colors">
                            {pdf.title}
                        </a>
                    ))}
                </div>
                <div className="bg-white p-6 rounded-3xl border border-[#C5A059]/20 shadow-sm space-y-4">
                    <h2 className="text-xl font-bold text-[#C5A059]">Preparation Material</h2>
                    {(config.preparation_pdfs as any[]).map((pdf, i) => (
                        <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#FDFBF7] border border-[#C5A059]/20 p-4 rounded-xl font-bold hover:border-[#C5A059] transition-colors">
                            {pdf.title}
                        </a>
                    ))}
                </div>
            </div>
        </main>
    </div>
  );
}