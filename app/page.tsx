"use client"

import Link from "next/link"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-7xl text-center">
          <Link
            href="/prompts"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors"
          >
            浏览全部提示词
          </Link>
        </div>
      </section>
    </main>
  )
}