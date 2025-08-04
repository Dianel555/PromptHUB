import { HeroSection } from "@/components/hero-section"
import { PromptGrid } from "@/components/prompt-grid"

export default function IndexPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <main className="flex-1">
        <PromptGrid />
      </main>
    </div>
  )
}
