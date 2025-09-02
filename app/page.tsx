import { HeroSection } from "@/components/hero-section"
import { PromptGrid } from "@/components/prompt-grid"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <PromptGrid />
    </main>
  )
}