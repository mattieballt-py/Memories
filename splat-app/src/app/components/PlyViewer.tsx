'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Viewer as GaussianSplatViewer } from '@mkkellogg/gaussian-splats-3d';

interface PlyViewerProps {
  plyUrl: string;
  showHelpers?: boolean;  // Show axes/grid for debugging
  backgroundColor?: number;  // Allow custom background
}

export default function PlyViewer({
  plyUrl,
  showHelpers = false,
  backgroundColor = 0x1a1a1a,
}: PlyViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [internalShowHelpers, setInternalShowHelpers] = useState(showHelpers);
  const viewerRef = useRef<GaussianSplatViewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing Gaussian Splat Viewer');
    console.log('PLY URL:', plyUrl);

    let viewer: GaussianSplatViewer | null = null;
    let mounted = true;

    const initViewer = async () => {
      try {
        // Create Gaussian Splat viewer
        viewer = new GaussianSplatViewer({
          cameraUp: [0, 1, 0],
          initialCameraPosition: [0, 0, 5],
          initialCameraLookAt: [0, 0, 0],
          sharedMemoryForWorkers: false,
        });

        viewerRef.current = viewer;

        // Set background color
        if (viewer.renderer && viewer.renderer.scene) {
          viewer.renderer.scene.background = new THREE.Color(backgroundColor);
        }

        // Mount viewer first
        if (containerRef.current && mounted) {
          containerRef.current.appendChild(viewer.rootElement);
        }

        // Add the splat scene directly from HTTP URL
        // The viewer library properly handles HTTP/HTTPS URLs
        console.log('Loading splat from URL:', plyUrl);

        if (!mounted) {
          console.log('Component unmounted, aborting load');
          return;
        }

        await viewer.addSplatScene(plyUrl, {
          showLoadingUI: false,
          progressiveLoad: true,
          splatAlphaRemovalThreshold: 5,
          onProgress: (progress: number, message: string) => {
            console.log(`Loading: ${(progress * 100).toFixed(0)}% - ${message}`);
          },
        });

        console.log('Splat scene added to viewer');
      } catch (error) {
        console.error('Error in initViewer:', error);
        throw error;
      }
    };

    const loadSplat = initViewer;

    loadSplat()
    .then(() => {
      console.log('Gaussian splat loaded successfully');

      // Get scene info
      const splatMesh = viewer.getSplatMesh();
      if (splatMesh) {
        const splatCount = splatMesh.getSplatCount();
        console.log('Splat count:', splatCount);

        // Calculate bounding box
        const boundingBox = new THREE.Box3();
        splatMesh.computeBoundingBox();
        if (splatMesh.geometry && splatMesh.geometry.boundingBox) {
          boundingBox.copy(splatMesh.geometry.boundingBox);
        }

        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        console.log('Bounding box:', {
          min: boundingBox.min.toArray(),
          max: boundingBox.max.toArray(),
          size: size.toArray(),
          center: center.toArray(),
        });

        // Position camera based on bounding box
        const maxDim = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxDim * 2;

        viewer.camera.position.set(
          center.x + cameraDistance,
          center.y + cameraDistance * 0.5,
          center.z + cameraDistance
        );
        viewer.camera.lookAt(center);
        viewer.controls.target.copy(center);
        viewer.controls.update();

        console.log('Camera positioned at:', viewer.camera.position.toArray());
        console.log('Looking at:', center.toArray());

        setDebugInfo(
          `Splats: ${splatCount.toLocaleString()} | ` +
          `Size: ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)}`
        );
      }

      // Add helpers if requested
      if (internalShowHelpers && viewer.renderer && viewer.renderer.scene) {
        const axesHelper = new THREE.AxesHelper(5);
        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        viewer.renderer.scene.add(axesHelper);
        viewer.renderer.scene.add(gridHelper);
      }

      setLoading(false);
    })
    .catch((err: Error) => {
      console.error('Error loading Gaussian splat:', err);
      setError(err.message || 'Failed to load 3D Gaussian splat');
      setLoading(false);
    });

    // Cleanup
    return () => {
      console.log('Cleaning up Gaussian Splat Viewer');
      mounted = false;
      if (viewer) {
        try {
          viewer.dispose();
        } catch (e) {
          console.error('Error disposing viewer:', e);
        }
      }
      if (containerRef.current && viewer && viewer.rootElement) {
        try {
          if (containerRef.current.contains(viewer.rootElement)) {
            containerRef.current.removeChild(viewer.rootElement);
          }
        } catch (e) {
          console.error('Error removing viewer element:', e);
        }
      }
    };
  }, [plyUrl, backgroundColor, internalShowHelpers]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-black mx-auto max-w-4xl">
      <div ref={containerRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-xl">Loading Gaussian splat...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-xl text-sm backdrop-blur-sm z-10">
            <div className="font-semibold mb-1">Controls:</div>
            <div className="text-xs opacity-80">
              Left drag: Rotate • Right drag: Pan • Scroll: Zoom
            </div>
          </div>

          {debugInfo && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-xl text-xs font-mono backdrop-blur-sm z-10">
              {debugInfo}
            </div>
          )}

          <button
            onClick={() => setInternalShowHelpers(!internalShowHelpers)}
            className="absolute top-4 left-4 bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-xl text-xs backdrop-blur-sm transition-colors z-10"
            title="Toggle axes and grid helpers"
          >
            {internalShowHelpers ? '🔍 Hide Helpers' : '🔍 Show Helpers'}
          </button>
        </>
      )}
    </div>
  );
}
