"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#3a5a66]/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-sm tracking-widest text-white uppercase">
          Timeless Mind
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="#gallery" className="text-sm text-white/90 hover:text-white transition-colors">
            gallery
          </Link>
          <Link href="#docs" className="text-sm text-white/90 hover:text-white transition-colors">
            docs
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/50 text-white hover:bg-white/10 rounded-full text-xs px-4 bg-transparent"
          >
            create 3D scene
          </Button>
        </nav>
      </div>
    </header>
  )
}