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
  const helpersRef = useRef<{ axes: THREE.AxesHelper; grid: THREE.GridHelper } | null>(null);
  const initialCameraPosition = useRef<THREE.Vector3 | null>(null);
  const initialCameraTarget = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing Gaussian Splat Viewer');
    console.log('PLY URL:', plyUrl);

    let viewer: GaussianSplatViewer | null = null;
    let mounted = true;

    const initViewer = async () => {
      try {
        // Create Gaussian Splat viewer
        // SHARP model creates splats where camera is at origin looking forward (+Z)
        viewer = new GaussianSplatViewer({
          cameraUp: [0, 1, 0],  // Standard up vector (Y-up)
          initialCameraPosition: [0, 0, 0],  // Start at origin (where photo was taken)
          initialCameraLookAt: [0, 0, 1],    // Look forward into the scene
          sharedMemoryForWorkers: false,
        });

        viewerRef.current = viewer;

        // Set background color
        if (viewer.scene) {
          viewer.scene.background = new THREE.Color(backgroundColor);
        }

        // Mount viewer first
        if (containerRef.current && mounted) {
          console.log('Appending viewer to DOM');
          containerRef.current.appendChild(viewer.rootElement);
          console.log('Viewer mounted, starting render');
          viewer.start();
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

      if (!viewer) {
        console.error('Viewer is null after loading');
        return;
      }

      // Get scene info
      const splatMesh = viewer.getSplatMesh();
      console.log('Got splat mesh:', splatMesh);

      if (splatMesh) {
        try {
          const splatCount = splatMesh.getSplatCount();
          console.log('Splat count:', splatCount);

          // Use the mesh's built-in getBoundingBox method (ignoreViewFrustum = true)
          const boundingBox = splatMesh.getBoundingBox(new THREE.Box3(), true);

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

          // SHARP model positions camera at origin looking at scene
          // Calculate appropriate distance to fit entire scene in view
          const maxDim = Math.max(size.x, size.y, size.z) || 5;

          // Position camera at origin (where photo was taken) but pulled back slightly
          // to ensure the entire reconstructed scene fits in view
          const cameraDistance = maxDim * 0.8; // Distance from origin

          // Camera at origin looking at scene center
          // The scene extends forward from origin in SHARP model
          const camPos = new THREE.Vector3(
            0,  // X: centered
            0,  // Y: at eye level
            -cameraDistance  // Z: back from origin to see full scene
          );

          // Look at the center of the reconstructed scene
          const lookAtTarget = new THREE.Vector3(center.x, center.y, center.z);

          viewer.camera.position.copy(camPos);
          viewer.camera.lookAt(lookAtTarget);
          viewer.controls.target.copy(lookAtTarget);

          // Save initial camera state for home button
          initialCameraPosition.current = camPos.clone();
          initialCameraTarget.current = lookAtTarget.clone();

          // Enable full rotation
          viewer.controls.enableRotate = true;
          viewer.controls.enablePan = true;
          viewer.controls.enableZoom = true;
          viewer.controls.minPolarAngle = 0; // Allow full vertical rotation
          viewer.controls.maxPolarAngle = Math.PI; // Allow full vertical rotation

          viewer.controls.update();

          console.log('Camera positioned at:', viewer.camera.position.toArray());
          console.log('Looking at:', center.toArray());

          setDebugInfo(
            `Splats: ${splatCount.toLocaleString()} | ` +
            `Size: ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)}`
          );
        } catch (err) {
          console.error('Error getting splat info:', err);
          setDebugInfo('Loaded successfully');
        }
      } else {
        console.warn('No splat mesh found');
        setDebugInfo('Loaded (mesh info unavailable)');
      }

      // Add helpers if requested
      if (internalShowHelpers && viewer.scene) {
        const axesHelper = new THREE.AxesHelper(5);
        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        viewer.scene.add(axesHelper);
        viewer.scene.add(gridHelper);
        helpersRef.current = { axes: axesHelper, grid: gridHelper };
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

      // Remove DOM element first (before disposing viewer)
      if (containerRef.current && viewer && viewer.rootElement) {
        try {
          if (containerRef.current.contains(viewer.rootElement)) {
            containerRef.current.removeChild(viewer.rootElement);
          }
        } catch (e) {
          // Silently ignore removeChild errors in StrictMode
        }
      }

      // Then dispose the viewer
      if (viewer) {
        try {
          viewer.dispose();
        } catch (e) {
          // Silently ignore disposal errors in StrictMode
        }
      }
    };
  }, [plyUrl, backgroundColor, internalShowHelpers]);

  // Separate effect to handle helpers toggle
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene) return;

    if (internalShowHelpers) {
      // Add helpers if they don't exist
      if (!helpersRef.current) {
        const axesHelper = new THREE.AxesHelper(5);
        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        viewer.scene.add(axesHelper);
        viewer.scene.add(gridHelper);
        helpersRef.current = { axes: axesHelper, grid: gridHelper };
      } else {
        // Re-add existing helpers
        viewer.scene.add(helpersRef.current.axes);
        viewer.scene.add(helpersRef.current.grid);
      }
    } else {
      // Remove helpers but keep reference
      if (helpersRef.current) {
        viewer.scene.remove(helpersRef.current.axes);
        viewer.scene.remove(helpersRef.current.grid);
      }
    }
  }, [internalShowHelpers]);

  // Function to reset camera to initial position
  const resetCamera = () => {
    const viewer = viewerRef.current;
    if (!viewer || !initialCameraPosition.current || !initialCameraTarget.current) return;

    // Smoothly animate back to initial position
    viewer.camera.position.copy(initialCameraPosition.current);
    viewer.camera.lookAt(initialCameraTarget.current);
    viewer.controls.target.copy(initialCameraTarget.current);
    viewer.controls.update();
  };

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

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <button
              onClick={() => setInternalShowHelpers(!internalShowHelpers)}
              className="bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-xl text-xs backdrop-blur-sm transition-colors"
              title="Toggle axes and grid helpers"
            >
              {internalShowHelpers ? '🔍 Hide Helpers' : '🔍 Show Helpers'}
            </button>
            <button
              onClick={resetCamera}
              className="bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-xl text-xs backdrop-blur-sm transition-colors"
              title="Reset camera to initial position"
            >
              🏠 Home View
            </button>
          </div>
        </>
      )}
    </div>
  );
}
