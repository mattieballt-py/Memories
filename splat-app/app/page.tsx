export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Welcome to Splat App</h1>
        <p className="text-lg">
          A Next.js application with 3D Gaussian Splatting capabilities
        </p>
        <div className="mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Next.js 15</li>
            <li>React Three Fiber</li>
            <li>React Three Gaussian Splat</li>
            <li>Three.js</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
