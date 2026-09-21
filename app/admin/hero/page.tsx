'use client';
import { useState } from 'react';
import { Upload, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HeroAdminPage() {
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => { toast.success('Hero image updated'); };
  
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Hero Section Configuration</h1>
      <div className="p-6 bg-white border rounded-3xl space-y-4">
        <input type="file" accept="image/*" className="w-full border p-3 rounded-xl" />
        <button onClick={handleUpload} className="bg-[#5D4037] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
           <Upload size={18} /> Upload Hero Image
        </button>
      </div>
    </div>
  );
}