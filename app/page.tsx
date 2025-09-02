"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { PromptGrid } from "@/components/prompt-grid"
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
      <PromptGrid />
    </main>
  )
}