"use client"

import { ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero-sky.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wider uppercase mb-2">
          Timeless Mind
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-8">
          Your World: <em>immortalised</em>
        </p>

        {/* Upload Box */}
        <div className="bg-[#4a6a76]/80 backdrop-blur-sm rounded-lg p-6 md:p-8 max-w-md mx-auto">
          <Button
            variant="secondary"
            className="w-full bg-[#7a9fac] hover:bg-[#8ab0bc] text-[#2a4a56] font-medium rounded-md mb-2"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Upload an image
          </Button>
          <p className="text-white/80 text-sm">or drop photo here</p>
        </div>

        <p className="text-white/60 text-xs mt-4">
          No ads, your 3D scene lives in a shareable link
        </p>
      </div>

      {/* Powered by text */}
      <div className="absolute bottom-4 right-4 z-10">
        <p className="text-white/60 text-xs">
          {"Powered by Apple's SHARP Gaussian splat model."}
        </p>
      </div>
    </section>
  )
}
