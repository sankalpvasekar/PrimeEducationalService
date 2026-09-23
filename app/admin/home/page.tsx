'use client';
import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomeAdminPage() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ highlight_text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config').then(res => res.json()).then(data => {
      setConfig({ highlight_text: data.highlight_text || '' });
      setLoading(false);
    });
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlight_text: config.highlight_text })
      });
      if (res.ok) toast.success('Text updated');
      else toast.error('Failed');
    } catch (err) {
      toast.error('Error');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Home Page Configuration</h1>
      <div className="p-6 bg-white border rounded-3xl space-y-4">
        <label className="block font-bold">Highlight Text</label>
        <textarea 
            className="w-full border p-3 rounded-xl" 
            value={config.highlight_text} 
            onChange={e => setConfig({...config, highlight_text: e.target.value})} 
        />
        <button onClick={handleUpdate} disabled={saving} className="bg-[#5D4037] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
           {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Update Text
        </button>
      </div>
    </div>
  );
}