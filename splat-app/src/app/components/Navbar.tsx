"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
      <nav className="max-w-6xl mx-auto bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-base tracking-wide text-white/95 hover:text-white transition-colors"
          >
            Timeless Mind
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm text-white/80 hover:text-white transition-colors hidden md:block"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-white/80 hover:text-white transition-colors hidden md:block"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm text-white/80 hover:text-white transition-colors hidden md:block"
            >
              FAQ
            </Link>
            <button
              className="px-4 py-2 bg-white/25 backdrop-blur-md hover:bg-white/35 text-white text-sm font-medium rounded-full border border-white/40 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
