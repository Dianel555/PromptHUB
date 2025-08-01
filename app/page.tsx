import { HeroSection } from "@/components/hero-section"
import { PromptGrid } from "@/components/prompt-grid"

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <main className="flex-1">
        <PromptGrid />
      </main>
    </div>
  )
}