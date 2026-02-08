"use client"

import { ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// Starting date and count
const START_DATE = new Date('2025-01-01')
const START_COUNT = 2734

// Generate deterministic random number (0-10) based on date
function getDailyIncrement(date: Date): number {
  const dateStr = date.toISOString().split('T')[0]
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash) % 11 // 0-10
}

// Calculate total count based on days elapsed
function calculateCount(): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let total = START_COUNT
  const currentDate = new Date(START_DATE)
  currentDate.setHours(0, 0, 0, 0)

  while (currentDate < today) {
    currentDate.setDate(currentDate.getDate() + 1)
    total += getDailyIncrement(currentDate)
  }

  return total
}

export function Hero() {
  const [count, setCount] = useState(START_COUNT)

  useEffect(() => {
    setCount(calculateCount())
  }, [])

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

      {/* Bottom right section */}
      <div className="absolute bottom-4 right-4 z-10 text-right">
        <p className="text-white/90 text-sm font-medium mb-1">
          {count.toLocaleString()} <span className="text-white/70">memories recreated</span>
        </p>
        <p className="text-white/60 text-xs">
          {"Powered by Apple's SHARP Gaussian splat model."}
        </p>
      </div>
    </section>
  )
}
