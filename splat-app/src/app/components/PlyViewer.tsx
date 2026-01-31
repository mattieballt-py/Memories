'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Viewer as GaussianSplatViewer } from '@mkkellogg/gaussian-splats-3d';

interface PlyViewerProps {
  plyUrl: string;
  backgroundColor?: number;  // Allow custom background
}

export default function PlyViewer({
  plyUrl,
  backgroundColor = 0x1a1a1a,
}: PlyViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const viewerRef = useRef<GaussianSplatViewer | null>(null);
  const initialCameraPosition = useRef<THREE.Vector3 | null>(null);
  const initialCameraTarget = useRef<THREE.Vector3 | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

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
          cameraUp: [0, -1, 0],  // Inverted up vector to flip view 180°
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

          // Enable full rotation - no limits
          viewer.controls.enableRotate = true;
          viewer.controls.enablePan = true;
          viewer.controls.enableZoom = true;
          // Remove polar angle limits to allow complete 360° rotation
          viewer.controls.minPolarAngle = -Infinity;
          viewer.controls.maxPolarAngle = Infinity;

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
  }, [plyUrl, backgroundColor]);

  // Function to reset camera to initial position
  const resetCamera = () => {
    const viewer = viewerRef.current;
    if (!viewer || !initialCameraPosition.current || !initialCameraTarget.current) {
      console.log('Cannot reset camera:', {
        hasViewer: !!viewer,
        hasPosition: !!initialCameraPosition.current,
        hasTarget: !!initialCameraTarget.current
      });
      return;
    }

    console.log('Resetting camera to:', initialCameraPosition.current.toArray());
    console.log('Resetting target to:', initialCameraTarget.current.toArray());

    // Stop any ongoing WASD movement
    keysPressed.current.clear();

    // Reset camera position and controls target
    viewer.camera.position.copy(initialCameraPosition.current);
    viewer.controls.target.copy(initialCameraTarget.current);

    // Update camera matrix
    viewer.camera.lookAt(initialCameraTarget.current);
    viewer.camera.updateMatrixWorld(true);

    // Force controls to update with new position/target
    viewer.controls.update();

    console.log('Camera reset complete. New position:', viewer.camera.position.toArray());
  };

  // WASD keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keysPressed.current.add(key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Animation loop for WASD movement
  useEffect(() => {
    let animationId: number | null = null;
    const moveSpeed = 0.1; // Units per frame

    const animate = () => {
      const viewer = viewerRef.current;

      if (viewer && keysPressed.current.size > 0) {
        const camera = viewer.camera;
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();

        // Get camera direction and right vector
        camera.getWorldDirection(direction);
        right.crossVectors(camera.up, direction).normalize();

        // Apply movement based on pressed keys (clone vectors before modifying)
        if (keysPressed.current.has('w')) {
          camera.position.add(direction.clone().multiplyScalar(moveSpeed));
        }
        if (keysPressed.current.has('s')) {
          camera.position.add(direction.clone().multiplyScalar(-moveSpeed));
        }
        if (keysPressed.current.has('a')) {
          camera.position.add(right.clone().multiplyScalar(moveSpeed));
        }
        if (keysPressed.current.has('d')) {
          camera.position.add(right.clone().multiplyScalar(-moveSpeed));
        }

        viewer.controls.update();

        // Continue animation loop only if keys are still pressed
        animationId = requestAnimationFrame(animate);
      } else {
        // Stop animation loop when no keys are pressed
        animationId = null;
      }
    };

    // Start animation only when a key is pressed
    const handleKeyPress = () => {
      if (animationId === null && keysPressed.current.size > 0) {
        animate();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

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
              Left drag: Rotate • Right drag: Pan • Scroll: Zoom<br />
              WASD: Move camera
            </div>
          </div>

          {debugInfo && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-xl text-xs font-mono backdrop-blur-sm z-10">
              {debugInfo}
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <button
              onClick={resetCamera}
              className="bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-xl text-xs backdrop-blur-sm transition-colors"
              title="Reset camera to initial position"
            >
              Home View
            </button>
          </div>
        </>
      )}
    </div>
  );
}
