'use client';
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PreparationAdminPage() {
  const handleUpload = () => { toast.success('Preparation PDF updated'); };
  
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Preparation Material</h1>
      <div className="p-6 bg-white border rounded-3xl space-y-4">
        <input type="file" accept=".pdf" className="w-full border p-3 rounded-xl" />
        <button onClick={handleUpload} className="bg-[#5D4037] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
           <FileText size={18} /> Upload PDF
        </button>
      </div>
    </div>
  );
}