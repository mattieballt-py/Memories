import Scene3D from "./components/Scene3D";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Welcome to Splat App</h1>
        <p className="text-lg mb-8">
          A Next.js application with 3D Gaussian Splatting capabilities
        </p>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3D Scene Preview</h2>
          <Scene3D />
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Next.js 14</li>
            <li>React Three Fiber</li>
            <li>React Three Drei</li>
            <li>Gaussian Splats 3D</li>
            <li>Three.js</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
