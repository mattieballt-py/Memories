export function Footer() {
  return (
    <footer className="bg-[#3a5a66] py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl text-white mb-4">
          Stay <span className="font-bold italic">Timeless</span>
        </h2>
        <div className="max-w-lg">
          <p className="text-white/80 leading-relaxed">
            A micro-lab for preserving moments as navigable 3D memories.
          </p>
          <p className="text-white/80 leading-relaxed mt-2">
            Built on state-of-the-art Gaussian splatting to turn photos into explorable worlds.
          </p>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Timeless Mind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}