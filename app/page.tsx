"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/hero-section"

import { useUnifiedStats } from "@/hooks/use-unified-data"

export default function HomePage() {
  const { refresh } = useUnifiedStats()
  
  // 页面加载时刷新数据
  useEffect(() => {
    refresh()
  }, [refresh])
  
  return (
    <main className="min-h-screen">
      <HeroSection />
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-7xl text-center">
          <a
            href="/prompts"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors"
          >
            浏览全部提示词
          </a>
        </div>
      </section>
    </main>
  )
}