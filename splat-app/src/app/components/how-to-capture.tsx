import { ImagePlus, Orbit, Share2 } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Upload an image",
    description: "Upload a single image of a place, object, or moment.",
    icon: ImagePlus,
  },
  {
    number: 2,
    title: "Explore your scene",
    description: "Gaussian splat model created to reconstruct your scene in 3D.",
    icon: Orbit,
  },
  {
    number: 3,
    title: "Share your world",
    description: "You receive an interactive link you can orbit, zoom, and send to anyone.",
    icon: Share2,
  },
]

export function HowToCapture() {
  return (
    <section id="how-it-works" className="bg-[#759AAD] py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2">
          How to Capture Your World
        </h2>
        <p className="text-white/80 mb-10 md:mb-14">
          One Image to 3D Scene in under a second.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col">
              {/* Placeholder Card */}
              <div className="bg-[#7a9fac] rounded-lg aspect-[4/3] mb-4 flex items-center justify-center">
                <step.icon className="w-12 h-12 text-white/40" />
              </div>
              
              {/* Step Info */}
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/50 text-[#759AAD] text-sm font-bold shrink-0 mt-0.5">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-white font-medium mb-1">{step.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
