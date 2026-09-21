import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-4">
        <Link href="/admin/hero" className="p-4 bg-white border rounded">Hero Section</Link>
        <Link href="/admin/company" className="p-4 bg-white border rounded">Company Info</Link>
        <Link href="/admin/preparation" className="p-4 bg-white border rounded">Preparation Material</Link>
        <Link href="/admin/payments" className="p-4 bg-white border rounded">Payment Config</Link>
      </div>
    </div>
  );
}