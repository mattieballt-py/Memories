'use client';
import { useState, useEffect } from 'react';
import PlyViewer from './components/PlyViewer';
import Navbar from './components/Navbar';

export default function Home() {
  const [plyUrl, setPlyUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup blob URL when component unmounts or plyUrl changes
  useEffect(() => {
    return () => {
      if (plyUrl && plyUrl.startsWith('blob:')) {
        URL.revokeObjectURL(plyUrl);
      }
    };
  }, [plyUrl]);

  const compressImage = async (file: File, maxSizeMB = 5): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if image is too large (max 2048px on longest side)
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to get under maxSizeMB
        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const sizeMB = blob.size / (1024 * 1024);

              // If still too large and quality can be reduced, try again
              if (sizeMB > maxSizeMB && quality > 0.3) {
                quality -= 0.1;
                tryCompress();
              } else {
                // Create a new File from the blob
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log(`Compressed image: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${sizeMB.toFixed(2)}MB`);
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // Compress image if it's larger than 5MB
      let processedFile = file;
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > 5) {
        console.log('Compressing large image...');
        processedFile = await compressImage(file, 5);
      }

      const formData = new FormData();
      formData.append('file', processedFile);

      // Call Modal API directly from client to avoid Vercel timeout
      const modalApiUrl = 'https://mattieballt-py--sharp-api-fastapi-app.modal.run/predict/ply';

      console.log('Calling Modal API directly:', modalApiUrl);
      console.log('File size:', (processedFile.size / 1024 / 1024).toFixed(2), 'MB');

      const response = await fetch(modalApiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Processing failed: ${response.statusText}`);
      }

      // Modal returns binary PLY file data
      const plyBlob = await response.blob();

      console.log('Received PLY file:', {
        size: plyBlob.size,
        type: plyBlob.type,
      });

      // Create a blob URL for local viewing
      const blobUrl = URL.createObjectURL(plyBlob);
      setPlyUrl(blobUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/skyhero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Navbar />

      {!plyUrl ? (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-16">
          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wider uppercase mb-2">
              Timeless Mind
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              Your World: <em>immortalised</em>
            </p>

            {/* Upload Box */}
            <div className="bg-[#4a6a76]/80 backdrop-blur-sm rounded-lg p-6 md:p-8 max-w-md mx-auto">
              <label className="block cursor-pointer">
                <div className="w-full bg-[#7a9fac] hover:bg-[#8ab0bc] text-[#2a4a56] font-medium rounded-md py-2 px-4 mb-2 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

              {uploading && (
                <div className="mt-4 text-center">
                  <div className="text-white text-base mb-2">Processing on GPU...</div>
                  <div className="text-white/60 text-sm">This may take 30-60 seconds</div>
                  <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                    <div className="bg-[#7a9fac] h-2 rounded-full animate-pulse w-full"></div>
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

          {/* Powered by text */}
          <div className="absolute bottom-4 right-4 z-10">
            <p className="text-white/60 text-xs">
              {"Powered by Apple's SHARP Gaussian splat model."}
            </p>
          </div>
        </section>
      ) : (
        <div className="relative z-10 container mx-auto px-6 py-20">
          <PlyViewer plyUrl={plyUrl} />
          <div className="flex gap-4 justify-center mt-6">
            <a
              href={plyUrl}
              download="output.ply"
              className="px-6 py-3 bg-[#7a9fac] hover:bg-[#8ab0bc] text-white rounded-xl transition-colors"
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
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              Upload Another Image
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
