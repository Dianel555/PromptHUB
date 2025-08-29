"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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

// 默认提示词数据（未登录时显示）
const defaultPrompts = [
  {
    id: 1,
    title: "AI图像生成专家",
    description:
      "创建令人惊叹的详细图像，包含风格修饰符、构图指南和高级参数控制，适用于各种AI图像生成工具。",
    author: "Alex Chen",
    tags: ["图像", "艺术", "精选"],
    likes: 1250,
    views: 8900,
    createdAt: "2024-01-15",
    isPublic: true,
  },
  {
    id: 2,
    title: "内容写作助手",
    description:
      "简化您的内容创作流程，适用于博客、文章和社交媒体帖子的多功能写作提示词。",
    author: "Sarah Kim",
    tags: ["写作", "内容"],
    likes: 890,
    views: 5600,
    createdAt: "2024-01-12",
    isPublic: true,
  },
  {
    id: 3,
    title: "代码调试器",
    description:
      "高效识别和修复代码中的错误，支持多种编程语言的结构化调试提示词。",
    author: "Mike Johnson",
    tags: ["代码", "开发"],
    likes: 2100,
    views: 12000,
    createdAt: "2024-01-10",
    isPublic: true,
  },
  {
    id: 4,
    title: "学术研究助手",
    description:
      "通过结构化的文献综述、方法论建议和引用格式来增强您的研究过程。",
    author: "Dr. Brown",
    tags: ["学术", "研究", "精选"],
    likes: 1450,
    views: 9800,
    createdAt: "2024-01-08",
    isPublic: true,
  },
  {
    id: 5,
    title: "开源项目文档生成器",
    description: "为开源项目创建清晰、全面的README和技术文档，提升项目可读性。",
    author: "Emma Davis",
    tags: ["开源", "文档"],
    likes: 980,
    views: 6700,
    createdAt: "2024-01-05",
    isPublic: true,
  },
  {
    id: 6,
    title: "社区讨论主持人",
    description: "专业引导和促进技术社区讨论，创建包容性的交流环境。",
    author: "Community Team",
    tags: ["社区", "协作"],
    likes: 750,
    views: 4200,
    createdAt: "2024-01-03",
    isPublic: true,
  },
]

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
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [prompts, setPrompts] = useState<any[]>([])

  useEffect(() => {
    if (status === "loading") return

    if (session?.user?.email) {
      // 登录用户：显示个人创建的提示词 + 公共提示词
      const userPrompts = getUserPrompts(session.user.email)
      const publicPrompts = defaultPrompts.filter((p) => p.isPublic)
      setPrompts([...userPrompts, ...publicPrompts])
    } else {
      // 未登录用户：只显示默认公共提示词
      setPrompts(defaultPrompts)
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
            ? "管理您的个人提示词，发现社区分享的优质内容"
            : "发现和分享高质量的AI提示词，提升您的AI交互体验"}
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
          <Card
            key={prompt.id}
            className="flex h-[320px] cursor-pointer flex-col transition-shadow hover:shadow-lg"
          >
            <CardHeader className="shrink-0 pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-2 flex-1 text-lg">
                  {prompt.title}
                </CardTitle>
                <div className="ml-2 flex shrink-0 gap-1">
                  {prompt.tags.includes("精选") && (
                    <Badge variant="secondary" className="text-xs">
                      精选
                    </Badge>
                  )}
                  {prompt.isOwner && (
                    <Badge variant="outline" className="text-xs">
                      我的
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between space-y-4">
              <div className="space-y-3">
                <CardDescription className="line-clamp-3 text-sm">
                  {prompt.description}
                </CardDescription>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1">
                  {prompt.tags
                    .filter((tag: string) => tag !== "精选")
                    .slice(0, 3)
                    .map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  {prompt.tags.filter((tag: string) => tag !== "精选").length >
                    3 && (
                    <Badge variant="outline" className="text-xs">
                      +
                      {prompt.tags.filter((tag: string) => tag !== "精选")
                        .length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="shrink-0 space-y-2">
                {/* 作者和统计信息 */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex min-w-0 items-center space-x-1">
                    <User className="size-4 shrink-0" />
                    <span className="truncate">{prompt.author}</span>
                  </div>
                  <div className="flex shrink-0 items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="size-4" />
                      <span>{prompt.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="size-4" />
                      <span>{prompt.views}</span>
                    </div>
                  </div>
                </div>

                {/* 创建时间 */}
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>{prompt.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {session ? "您还没有创建任何提示词" : "没有找到匹配的提示词"}
          </p>
          {session && (
            <Button asChild className="mt-4">
              <Link href="/create">
                <Plus className="mr-2 size-4" />
                创建第一个提示词
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
