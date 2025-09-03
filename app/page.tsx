"use client"

import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { HomepagePromptCard } from "@/components/homepage-prompt-card"

const mockPrompts = [
  { id: "1", title: "AI图像生成专家", description: "创建令人惊叹的详细图像，包含风格修饰符、构图指南和高级参数控制。适用于各种AI图像生成工具。", tags: ["图像", "艺术", "精选"] },
  { id: "2", title: "内容写作助手", description: "简化您的内容创作流程，适用于博客、文章和社交媒体帖子的多功能写作提示词。", tags: ["写作", "内容"] },
  { id: "3", title: "代码调试器", description: "高效识别和修复代码中的错误，支持多种编程语言的结构化调试提示词。", tags: ["代码", "开发"] },
  { id: "4", title: "学术研究助手", description: "通过结构化的文献综述、方法论建议和引用格式来增强您的研究过程。", tags: ["学术", "研究", "精选"] },
  { id: "5", title: "开源项目文档生成器", description: "为开源项目创建清晰、全面的README和技术文档，提升项目可读性。包括安装指南、使用说明、API文档和贡献指南，让开发者快速上手。", tags: ["开源", "文档"] },
  { id: "6", title: "社区讨论主持人", description: "专业引导和促进技术社区讨论，创建包容性的交流环境。帮助维护社区秩序，鼓励建设性对话，解决冲突，提升整体讨论质量和参与度。", tags: ["社区", "协作"] },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">精选提示词</h2>
            <p className="text-muted-foreground mt-2">仅作静态展示，去 /prompts 管理你的提示词</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {mockPrompts.map((p) => (
              <HomepagePromptCard
                key={p.id}
                id={p.id}
                title={p.title}
                description={p.description}
                tags={p.tags}
                className="h-[280px] pointer-events-none select-none"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/prompts"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors"
            >
              浏览全部提示词
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}