'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

interface PlyViewerProps {
  plyUrl: string;
}

export default function PlyViewer({ plyUrl }: PlyViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load PLY file
    const loader = new PLYLoader();
    loader.load(
      plyUrl,
      (geometry) => {
        // Center and scale geometry
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox!.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        const maxSize = Math.max(
          geometry.boundingBox!.max.x - geometry.boundingBox!.min.x,
          geometry.boundingBox!.max.y - geometry.boundingBox!.min.y,
          geometry.boundingBox!.max.z - geometry.boundingBox!.min.z
        );
        const scale = 2 / maxSize;
        geometry.scale(scale, scale, scale);

        // Create point cloud material with vertex colors if available
        const material = new THREE.PointsMaterial({
          size: 0.01,
          vertexColors: geometry.attributes.color ? true : false,
          sizeAttenuation: true,
        });

        // If no vertex colors, use a default color
        if (!geometry.attributes.color) {
          material.color = new THREE.Color(0x00aaff);
        }

        // Create points mesh
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        setLoading(false);
      },
      (progress) => {
        console.log('Loading PLY:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading PLY:', error);
        setError('Failed to load 3D point cloud');
        setLoading(false);
      }
    );

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
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
      renderer.dispose();
      controls.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [plyUrl]);

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
        <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-xl text-sm">
          Drag to rotate • Scroll to zoom
        </div>
      )}
    </div>
  );
}
