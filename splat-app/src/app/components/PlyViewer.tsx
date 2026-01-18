'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

interface PlyViewerProps {
  plyUrl: string;
  pointSize?: number;  // Allow customization
  showHelpers?: boolean;  // Show axes/grid for debugging
  backgroundColor?: number;  // Allow custom background
}

export default function PlyViewer({
  plyUrl,
  pointSize = 0.03,  // Increased default size for better visibility
  showHelpers = false,
  backgroundColor = 0x1a1a1a,
}: PlyViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    // Camera setup with better initial values
    const camera = new THREE.PerspectiveCamera(
      60,  // FOV - 60 is more natural than 75
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.01,  // Near plane - closer for small objects
      1000   // Far plane - keep large for big point clouds
    );

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Controls setup with better defaults
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;  // Enable screen-space panning
    controls.minDistance = 0.1;  // Allow getting very close
    controls.maxDistance = 500;  // Allow zooming far out
    controls.maxPolarAngle = Math.PI;  // Allow full rotation

    // Lighting (for any potential materials, though points don't need it)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Add debugging helpers if enabled
    let axesHelper: THREE.AxesHelper | null = null;
    let gridHelper: THREE.GridHelper | null = null;
    if (showHelpers) {
      axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
      gridHelper = new THREE.GridHelper(10, 10);
      scene.add(gridHelper);
    }

    // Load PLY file
    const loader = new PLYLoader();
    loader.load(
      plyUrl,
      (geometry) => {
        console.log('PLY loaded successfully');
        console.log('Vertex count:', geometry.attributes.position.count);
        console.log('Has colors:', !!geometry.attributes.color);

        // Step 1: Compute bounding box FIRST (before any transformations)
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox!;

        // Step 2: Calculate center and size
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        // Step 3: Calculate bounding sphere radius
        const maxDim = Math.max(size.x, size.y, size.z);
        const boundingSphereRadius = maxDim / 2;

        console.log('Bounding box:', {
          min: boundingBox.min.toArray(),
          max: boundingBox.max.toArray(),
          center: center.toArray(),
          size: size.toArray(),
          boundingSphereRadius,
        });

        // Step 4: Center geometry at origin
        geometry.translate(-center.x, -center.y, -center.z);

        // Step 5: Scale geometry to fit in a reasonable size (e.g., ~2 units)
        const targetSize = 2.0;  // Target size in world units
        const scaleFactor = targetSize / maxDim;
        geometry.scale(scaleFactor, scaleFactor, scaleFactor);

        console.log('Applied transformations:', {
          translation: center.toArray().map(v => -v),
          scale: scaleFactor,
          finalSize: maxDim * scaleFactor,
        });

        // Step 6: Create material with proper settings for point clouds
        const material = new THREE.PointsMaterial({
          size: pointSize,
          vertexColors: !!geometry.attributes.color,  // Use vertex colors if available
          sizeAttenuation: true,  // Points get smaller with distance
          transparent: false,
          opacity: 1.0,
          fog: false,
        });

        // If no vertex colors, use a visible default color
        if (!geometry.attributes.color) {
          material.color = new THREE.Color(0xffffff);  // White is more visible
          console.log('No vertex colors found, using default white');
        } else {
          console.log('Using vertex colors from PLY file');
        }

        // Step 7: Create points mesh and add to scene
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Step 8: Position camera based on bounding sphere
        // Camera should be far enough to see entire object
        const scaledRadius = boundingSphereRadius * scaleFactor;
        const cameraDistance = scaledRadius * 3;  // 3x radius for good view

        camera.position.set(
          cameraDistance,
          cameraDistance * 0.5,  // Slightly elevated
          cameraDistance
        );
        camera.lookAt(0, 0, 0);  // Look at center (origin)

        // Update controls target to look at center
        controls.target.set(0, 0, 0);
        controls.update();

        // Update camera clipping planes based on model size
        camera.near = scaledRadius * 0.01;
        camera.far = scaledRadius * 100;
        camera.updateProjectionMatrix();

        console.log('Camera setup:', {
          position: camera.position.toArray(),
          distance: cameraDistance,
          near: camera.near,
          far: camera.far,
        });

        // Update debug info
        setDebugInfo(
          `Points: ${geometry.attributes.position.count.toLocaleString()} | ` +
          `Size: ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)} | ` +
          `Scaled: ${(maxDim * scaleFactor).toFixed(2)} units`
        );

        setLoading(false);
      },
      (progress) => {
        const percent = progress.total > 0
          ? ((progress.loaded / progress.total) * 100).toFixed(0)
          : '...';
        console.log(`Loading PLY: ${percent}%`);
      },
      (error) => {
        console.error('Error loading PLY:', error);
        setError('Failed to load 3D point cloud');
        setLoading(false);
      }
    );

    // Animation loop
    let animationId: number;
    function animate() {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      controls.dispose();

      // Clean up helpers
      if (axesHelper) scene.remove(axesHelper);
      if (gridHelper) scene.remove(gridHelper);

      // Clean up geometry and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });

      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [plyUrl, pointSize, showHelpers, backgroundColor]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-black mx-auto max-w-4xl">
      <div ref={containerRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-xl">Loading 3D point cloud...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-xl text-sm backdrop-blur-sm">
            <div className="font-semibold mb-1">Controls:</div>
            <div className="text-xs opacity-80">
              Left drag: Rotate • Right drag: Pan • Scroll: Zoom
            </div>
          </div>

          {debugInfo && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-xl text-xs font-mono backdrop-blur-sm">
              {debugInfo}
            </div>
          )}
        </>
      )}
    </div>
  );
}
