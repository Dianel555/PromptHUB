"use client"

import { DebugPromptCard } from "@/components/debug-prompt-card"

const testData = [
  {
    id: "1",
    title: "AI图像生成专家",
    description: "创建令人惊叹的详细图像，包含风格修饰符、构图指南和高级参数控制。适用于各种AI图像生成工具。",
    tags: ["图像", "艺术", "精选"]
  },
  {
    id: "2", 
    title: "内容写作助手",
    description: "简化您的内容创作流程，适用于博客、文章和社交媒体帖子的多功能写作提示词。",
    tags: ["写作", "内容"]
  }
]

export default function DebugTagsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">标签调试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testData.map((prompt) => (
          <DebugPromptCard
            key={prompt.id}
            id={prompt.id}
            title={prompt.title}
            description={prompt.description}
            tags={prompt.tags}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">测试数据:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>
    </div>
  )
}