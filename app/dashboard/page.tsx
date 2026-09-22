import { query } from '@/lib/db';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) redirect('/login');
  
  const payload = verifyToken(token);
  if (!payload) redirect('/login');

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 font-sans">
        <main className="max-w-4xl mx-auto space-y-8">
            <Link href="/" className="flex items-center text-[#5D4037] font-bold hover:underline">
                <ArrowLeft className="mr-2" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-[#5D4037]">Dashboard</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <Link href="/dashboard/company" className="block bg-white p-8 rounded-3xl border border-[#C5A059]/20 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-2xl font-bold text-[#5D4037]">Company Information</h2>
                    <p className="text-[#A1887F] mt-2">Click to view documents</p>
                </Link>
                <Link href="/dashboard/preparation" className="block bg-white p-8 rounded-3xl border border-[#C5A059]/20 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-2xl font-bold text-[#C5A059]">Preparation Material</h2>
                    <p className="text-[#A1887F] mt-2">Click to view materials</p>
                </Link>
            </div>
        </main>
    </div>
  );
}