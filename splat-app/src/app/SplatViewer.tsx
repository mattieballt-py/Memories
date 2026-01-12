'use client';
import { Canvas } from '@react-three/fiber';
import { GaussianSplat } from '@react-three/gaussian-splat';
import { OrbitControls } from '@react-three/drei';

interface SplatViewerProps {
  splatUrl: string;
}

export default function SplatViewer({ splatUrl }: SplatViewerProps) {
  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-black mx-auto max-w-4xl">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <GaussianSplat src={splatUrl} />
        <OrbitControls />
      </Canvas>
      
      <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-xl">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
