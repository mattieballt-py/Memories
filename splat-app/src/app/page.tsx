'use client';
import { useState, useEffect } from 'react';
import PlyViewer from './components/PlyViewer';
import Navbar from './components/Navbar';
import { HowToCapture } from './components/how-to-capture';
import { Pricing } from './components/pricing';
import { FAQ } from './components/faq';
import { Footer } from './components/footer';

// Counter logic
const START_DATE = new Date('2025-01-01');
const START_COUNT = 2734;

function getDailyIncrement(date: Date): number {
  const dateStr = date.toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % 11; // 0-10
}

function calculateCount(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let total = START_COUNT;
  const currentDate = new Date(START_DATE);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate < today) {
    currentDate.setDate(currentDate.getDate() + 1);
    total += getDailyIncrement(currentDate);
  }

  return total;
}

export default function Home() {
  const [plyUrl, setPlyUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(START_COUNT);

  // Calculate counter on mount
  useEffect(() => {
    setCount(calculateCount());
  }, []);

  // Cleanup blob URL when component unmounts or plyUrl changes
  useEffect(() => {
    return () => {
      if (plyUrl && plyUrl.startsWith('blob:')) {
        URL.revokeObjectURL(plyUrl);
      }
    };
  }, [plyUrl]);

  // Generate shareable link when plyUrl is set
  useEffect(() => {
    if (plyUrl && !plyUrl.startsWith('blob:')) {
      // Encode the URL to base64 for the share link (URL-safe)
      const encodedUrl = btoa(plyUrl).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      const shareUrl = `${window.location.origin}/view/${encodedUrl}`;
      setShareableLink(shareUrl);
    }
  }, [plyUrl]);

  // Copy link to clipboard
  const copyShareLink = async () => {
    if (!shareableLink) return;

    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
        // Try to get detailed error message from response
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || response.statusText;
        throw new Error(`Upload failed: ${errorMessage}`);
      }

      // API now returns JSON with ply_url (uploaded to Vercel Blob)
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.ply_url) {
        throw new Error('No PLY URL returned from server');
      }

      console.log('Received PLY URL:', data.ply_url);
      console.log('PLY size:', data.size, 'bytes');

      // Set the public HTTP URL directly - no blob URL needed!
      setPlyUrl(data.ply_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative">
      <Navbar />

      {!plyUrl ? (
        <section
          className="relative min-h-screen flex flex-col items-center justify-center pt-16"
          style={{
            backgroundImage: "url('/skyhero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tighter font-bold text-white tracking-wider uppercase mb-2">
              Timeless Mind
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              Your World: <em>immortalised</em>
            </p>

            {/* Upload Box */}
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 md:p-10 max-w-md mx-auto">
              {!uploading && (
                <>
                  <label className="block cursor-pointer">
                    <div className="w-full bg-white/25 backdrop-blur-md hover:bg-white/35 text-white font-medium rounded-2xl py-3 px-6 mb-3 transition-all duration-200 flex items-center justify-center border border-white/40 shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload an image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-white/80 text-sm">or drop photo here</p>
                </>
              )}

              {uploading && (
                <div className="mt-4 text-center">
                  <div className="text-white text-base mb-2">Processing on GPU...</div>
                  <div className="text-white/70 text-sm">This may take more than 1 second</div>
                  <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white/60 h-2 rounded-full animate-pulse w-full"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}
            </div>

            <p className="text-white/60 text-xs mt-4">
              No ads, your 3D scene lives in a shareable link
            </p>
          </div>

          {/* Bottom right section */}
          <div className="absolute bottom-4 right-4 z-10 text-right">
            <p className="text-white/90 text-sm font-medium mb-1">
              {count.toLocaleString()} <span className="text-white/70">memories recreated</span>
            </p>
            <p className="text-white/60 text-xs">
              {"Powered by Apple's SHARP Gaussian splat model."}
            </p>
          </div>
        </section>
      ) : (
        <div className="relative z-10 container mx-auto px-6 py-20">
          <PlyViewer plyUrl={plyUrl} />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            {shareableLink && (
              <button
                onClick={copyShareLink}
                className="px-6 py-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-white rounded-2xl border border-white/50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Copy Share Link
                  </>
                )}
              </button>
            )}

            <a
              href={plyUrl}
              download="output.ply"
              className="px-6 py-3 bg-white/25 backdrop-blur-md hover:bg-white/35 text-white rounded-2xl border border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-center"
            >
              Download PLY File
            </a>

            <button
              onClick={() => {
                if (plyUrl && plyUrl.startsWith('blob:')) {
                  URL.revokeObjectURL(plyUrl);
                }
                setPlyUrl(null);
                setError(null);
                setShareableLink(null);
                setCopied(false);
              }}
              className="px-6 py-3 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white rounded-2xl border border-white/30 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Upload Another Image
            </button>
          </div>
        </div>
      )}

      {/* Additional sections - always visible */}
      <HowToCapture />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
