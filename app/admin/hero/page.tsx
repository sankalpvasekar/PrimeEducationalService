'use client';
import { useEffect, useState } from 'react';
import { Upload, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function HeroAdminPage() {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        setHeroImages(data.hero_images || []);
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
          const errorData = await res.json();
          console.error('Cloudinary Error:', errorData);
          throw new Error('Cloudinary upload failed');
      }
      
      const data = await res.json();
      const newUrl = data.secure_url;
      console.log('DEBUG: Cloudinary upload successful:', newUrl);

      const newImages = [...heroImages, newUrl];

      // 2. Save to DB
      const dbRes = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_images: newImages })
      });
      
      if (!dbRes.ok) throw new Error('Database save failed');

      setHeroImages(newImages);
      toast.success('Hero image added');
    } catch (err) {
      console.error('Upload Error:', err);
      toast.error('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const newImages = heroImages.filter((_, i) => i !== index);
    await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_images: newImages })
    });
    setHeroImages(newImages);
    toast.success('Image deleted');
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Manage Hero Images</h1>
      <div className="grid grid-cols-2 gap-4">
        {heroImages.map((img, i) => (
            img && img.trim() !== '' ? (
                <div key={i} className="relative group">
                    <Image src={img} alt="Hero" width={200} height={100} className="rounded-xl" />
                    <button onClick={() => handleDelete(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><Trash2 size={16} /></button>
                </div>
            ) : null
        ))}
      </div>
      <div className="p-6 bg-white border rounded-3xl space-y-4">
        <input type="file" accept="image/*" onChange={handleUpload} className="w-full border p-3 rounded-xl" disabled={uploading} />
        {uploading && <Loader2 className="animate-spin" />}
      </div>
    </div>
  );
}