'use client';
import { useState } from 'react';
import PlyViewer from './components/PlyViewer';

export default function Home() {
  const [plyUrl, setPlyUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/create-splat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPlyUrl(data.ply_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-white mb-8">
          1 Photo → 3D Point Cloud
        </h1>

        {!plyUrl ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <label className="block mb-4">
                <span className="text-white text-lg mb-2 block">Upload an image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                  className="w-full p-4 bg-white rounded-xl text-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                  disabled={uploading}
                />
              </label>

              {uploading && (
                <div className="mt-4 text-center">
                  <div className="text-white text-lg mb-2">Processing on GPU...</div>
                  <div className="text-white/60">This may take 30-60 seconds</div>
                  <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse w-full"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <PlyViewer plyUrl={plyUrl} />
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setPlyUrl(null);
                  setError(null);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                Upload Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
