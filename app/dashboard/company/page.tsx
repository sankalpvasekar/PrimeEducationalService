import { query } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function CompanyDashboard() {
  const configs = await query<any>('SELECT company_pdfs FROM admins_data LIMIT 1');
  const pdfs = configs[0]?.company_pdfs || [];

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen">
      <Link href="/dashboard" className="flex items-center text-[#5D4037] font-bold mb-6 hover:underline">
        <ArrowLeft className="mr-2" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-[#5D4037]">Company Information</h1>
      <div className="space-y-4">
        {pdfs.map((pdf: any, i: number) => (
          <iframe key={i} src={pdf.url} className="w-full h-[600px] rounded-xl border" title={pdf.title} />
        ))}
      </div>
    </div>
  );
}