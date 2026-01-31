'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PlyViewer from '@/app/components/PlyViewer';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

export default function ViewPage() {
  const params = useParams();
  const [plyUrl, setPlyUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Decode the ID (which is base64 encoded URL)
      const encodedUrl = params.id as string;
      const decodedUrl = atob(encodedUrl.replace(/-/g, '+').replace(/_/g, '/'));

      // Validate URL
      if (decodedUrl.startsWith('https://')) {
        setPlyUrl(decodedUrl);
      } else {
        setError('Invalid share link');
      }
    } catch (err) {
      console.error('Error decoding URL:', err);
      setError('Invalid share link');
    }
  }, [params.id]);

  return (
    <main className="relative min-h-screen bg-[#618497]">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        {error ? (
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 max-w-md mx-auto">
              <h2 className="text-white text-xl font-bold mb-2">Error Loading Scene</h2>
              <p className="text-red-200 mb-4">{error}</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-white/25 backdrop-blur-md hover:bg-white/35 text-white rounded-2xl border border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Create Your Own
              </Link>
            </div>
          </div>
        ) : plyUrl ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Shared 3D Scene
              </h1>
              <p className="text-white/80">
                Explore this immersive Gaussian splat scene
              </p>
            </div>

            <PlyViewer plyUrl={plyUrl} />

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a
                href={plyUrl}
                download="scene.ply"
                className="px-6 py-3 bg-white/25 backdrop-blur-md hover:bg-white/35 text-white rounded-2xl border border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-center"
              >
                Download PLY File
              </a>
              <Link
                href="/"
                className="px-6 py-3 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white rounded-2xl border border-white/30 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-center"
              >
                Create Your Own
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-white text-xl">
            Loading scene...
          </div>
        )}
      </div>
    </main>
  );
}
