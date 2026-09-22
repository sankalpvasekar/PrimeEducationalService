'use client';
import { useEffect, useState } from 'react';
import { Upload, FileText, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CompanyAdminPage() {
  const [pdfs, setPdfs] = useState<{url: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/config').then(res => res.json()).then(data => {
      setPdfs(data.company_pdfs || []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (index: number) => {
    const newPdfs = pdfs.filter((_, i) => i !== index);
    // TODO: Implement API call to save newPdfs to DB
    setPdfs(newPdfs);
    toast.success('PDF deleted');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Manage Company Info PDFs</h1>
      <div className="space-y-4">
        {pdfs.map((pdf, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-white border rounded-xl">
            <span>{pdf.title}</span>
            <button onClick={() => handleDelete(i)} className="text-red-500"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
      <div className="p-6 bg-white border rounded-3xl space-y-4">
        <input type="file" accept=".pdf" className="w-full border p-3 rounded-xl" />
        <button className="bg-[#5D4037] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
           <Upload size={18} /> Upload New PDF
        </button>
      </div>
    </div>
  );
}