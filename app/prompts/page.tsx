"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Eye, Heart, Plus, User } from "lucide-react"
import { useSession } from "next-auth/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PromptCard } from "@/components/prompt-card"

// 注意：主页展示的虚假提示词已被移除，避免在prompts页面造成混淆
// 这里只保留真实的用户创建的提示词数据

// 模拟用户个人提示词数据
const getUserPrompts = (userEmail: string) => [
  {
    id: 101,
    title: "我的个人助手",
    description: "专门为我定制的个人AI助手，了解我的工作习惯和偏好。",
    author: userEmail?.split("@")[0] || "我",
    tags: ["个人", "助手"],
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString().split("T")[0],
    isPublic: false,
    isOwner: true,
  },
  {
    id: 102,
    title: "项目管理专家",
    description: "帮助我管理项目进度，制定计划和跟踪任务完成情况。",
    author: userEmail?.split("@")[0] || "我",
    tags: ["项目", "管理"],
    likes: 5,
    views: 23,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isPublic: true,
    isOwner: true,
  },
]

export default function PromptsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [prompts, setPrompts] = useState<any[]>([])

  useEffect(() => {
    if (status === "loading") return

    if (session?.user?.email) {
      // 登录用户：显示个人创建的提示词
      const userPrompts = getUserPrompts(session.user.email)
      setPrompts(userPrompts)
    } else {
      // 未登录用户：显示空列表，引导用户登录
      setPrompts([])
    }
  }, [session, status])

  // 获取所有标签
  const allTags = Array.from(new Set(prompts.flatMap((prompt) => prompt.tags)))

  // 过滤提示词
  const filteredPrompts =
    selectedTags.length === 0
      ? prompts
      : prompts.filter((prompt) =>
          selectedTags.some((tag) => prompt.tags.includes(tag))
        )

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {session ? "我的提示词库" : "提示词库"}
          </h1>
          {session && (
            <Button asChild>
              <Link href="/create">
                <Plus className="mr-2 size-4" />
                创建提示词
              </Link>
            </Button>
          )}
        </div>
        <p className="mb-6 text-muted-foreground">
          {session
            ? "管理您的个人提示词，创建和分享优质内容"
            : "登录后可以创建和管理您的个人提示词库"}
        </p>

        {/* 标签过滤器 */}
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="mr-2 text-sm font-medium text-muted-foreground">
              筛选标签:
            </span>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="text-xs"
              >
                清除筛选
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 提示词网格 - 固定高度确保卡片尺寸统一 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            id={prompt.id}
            title={prompt.title}
            description={prompt.description}
            content={`这是 ${prompt.title} 的示例内容。您可以使用这个提示词来${prompt.description.substring(0, 50)}...`}
            author={{
              name: prompt.author,
              avatar: "/placeholder.svg?height=32&width=32",
              id: prompt.author.toLowerCase().replace(/\s+/g, '')
            }}
            tags={prompt.tags}
            likes={prompt.likes}
            views={prompt.views}
            createdAt={prompt.createdAt}
            isOwner={prompt.isOwner}
            showPreview={true}
            onEdit={() => {
              // 跳转到编辑页面
              router.push(`/prompts/${prompt.id}/edit`)
            }}
          />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {session ? "您还没有创建任何提示词" : "请先登录以查看和管理您的提示词"}
          </p>
          {session ? (
            <Button asChild className="mt-4">
              <Link href="/create">
                <Plus className="mr-2 size-4" />
                创建第一个提示词
              </Link>
            </Button>
          ) : (
            <Button asChild className="mt-4">
              <Link href="/auth/signin">
                登录账户
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
