'use client';
import { useState } from 'react';
import SplatViewer from './SplatViewer';

export default function Home() {
  const [splatUrl, setSplatUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/create-splat', {
      method: 'POST',
      body: formData,
    });
    
    const { splatUrl } = await response.json();
    setSplatUrl(splatUrl);
    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-white mb-8">
          1 Photo → 3D Splat → Instagram Reel
        </h1>
        
        {!splatUrl ? (
          <div className="max-w-md mx-auto">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
              className="w-full p-4 bg-white rounded-xl text-lg"
              disabled={uploading}
            />
            {uploading && (
              <div className="mt-4 text-center text-white">
                Processing on GPU... 30 seconds
              </div>
            )}
          </div>
        ) : (
          <SplatViewer splatUrl={splatUrl} />
        )}
      </div>
    </main>
  );
}
