"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

import { TagType, getTagThemeClasses } from "@/lib/enhanced-tag-system"

import { HomepagePromptCard } from "./homepage-prompt-card"

// 模拟数据
const mockPrompts = [
  {
    id: "1",
    title: "AI图像生成专家",
    description:
      "创建令人惊叹的详细图像，包含风格修饰符、构图指南和高级参数控制。适用于各种AI图像生成工具。",
    author: {
      name: "Alex Chen",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alex`,
    },
    tags: ["图像", "艺术", "精选"],
    likes: 1250,
    views: 8900,
    createdAt: new Date("2024-01-15"),
    featured: true,
  },
  {
    id: "2",
    title: "内容写作助手",
    description:
      "简化您的内容创作流程，适用于博客、文章和社交媒体帖子的多功能写作提示词。",
    author: {
      name: "Sarah Kim",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=sarah`,
    },
    tags: ["写作", "内容"],
    likes: 890,
    views: 5600,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "代码调试器",
    description:
      "高效识别和修复代码中的错误，支持多种编程语言的结构化调试提示词。",
    author: {
      name: "Mike Johnson",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=mike`,
    },
    tags: ["代码", "开发"],
    likes: 2100,
    views: 12000,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "4",
    title: "学术研究助手",
    description:
      "通过结构化的文献综述、方法论建议和引用格式来增强您的研究过程。",
    author: {
      name: "Dr. Brown",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=brown`,
    },
    tags: ["学术", "研究", "精选"],
    likes: 1450,
    views: 9800,
    createdAt: new Date("2024-02-01"),
    featured: true,
  },
  {
    id: "5",
    title: "开源项目文档生成器",
    description:
      "为开源项目创建清晰、全面的README和技术文档，提升项目可读性。包括安装指南、使用说明、API文档和贡献指南，让开发者快速上手。",
    author: {
      name: "Emma Davis",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=emma`,
    },
    tags: ["开源", "文档"],
    likes: 980,
    views: 6700,
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    title: "社区讨论主持人",
    description:
      "专业引导和促进技术社区讨论，创建包容性的交流环境。帮助维护社区秩序，鼓励建设性对话，解决冲突，提升整体讨论质量和参与度。",
    author: {
      name: "Community Team",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=community`,
    },
    tags: ["社区", "协作"],
    likes: 750,
    views: 4200,
    createdAt: new Date("2024-02-10"),
  },
]

interface PromptGridProps {
  searchQuery?: string
  selectedCategory?: string
}

export function PromptGrid({
  searchQuery = "",
  selectedCategory = "",
}: PromptGridProps) {
  const { data: session, status } = useSession()
  const { theme, resolvedTheme } = useTheme()
  const router = useRouter()
  const [currentCategory, setCurrentCategory] = useState(selectedCategory)
  const [displayCount, setDisplayCount] = useState(6)

  // 检测当前是否为深色模式
  const isDark = resolvedTheme === "dark"
  // 过滤提示词
  const filteredPrompts = mockPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      !currentCategory ||
      currentCategory === "全部" ||
      prompt.tags.includes(currentCategory)
    return matchesSearch && matchesCategory
  })

  // 显示的提示词（支持分页加载）
  const displayedPrompts = filteredPrompts.slice(0, displayCount)

  const handleCategoryChange = (category: string) => {
    // 检查用户是否已登录
    if (status === "unauthenticated") {
      router.push(
        "/auth/signin?callbackUrl=" +
          encodeURIComponent(window.location.pathname)
      )
      return
    }

    setCurrentCategory(category === "全部" ? "" : category)
    setDisplayCount(6) // 重置显示数量
  }

  const handleLoadMore = () => {
    // 检查用户是否已登录
    if (status === "unauthenticated") {
      router.push(
        "/auth/signin?callbackUrl=" +
          encodeURIComponent(window.location.pathname)
      )
      return
    }

    setDisplayCount((prev) => prev + 6)
  }

  return (
    <section className="px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            社区精选提示词
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            发现由开源社区精心制作的高质量提示词，共同提升AI体验
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {["全部", "图像", "写作", "代码", "学术", "开源", "社区"].map(
            (category, index) => {
              const isActive =
                currentCategory === category ||
                (category === "全部" && !currentCategory)
              const colorScheme =
                category !== "全部"
                  ? getTagThemeClasses(category as TagType, "solid")
                  : null
              const isAuthenticated = status === "authenticated"

              return (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? colorScheme
                        ? `${colorScheme} shadow-lg`
                        : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                      : `glass-effect text-muted-foreground hover:bg-accent/10 hover:text-foreground ${
                          !isAuthenticated ? "opacity-75 hover:opacity-90" : ""
                        }`
                  }`}
                  whileHover={{ scale: isAuthenticated ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {category}
                </motion.button>
              )
            }
          )}
        </motion.div>

        {/* 提示词网格 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedPrompts.map((prompt, index) => (
            <HomepagePromptCard
              key={prompt.id}
              {...prompt}
            />
          ))}
        </div>

        {/* 加载更多按钮 */}
        {displayCount < filteredPrompts.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={handleLoadMore}
              className={`glass-effect rounded-full px-8 py-3 font-medium transition-all duration-300 ${
                status === "authenticated"
                  ? "text-foreground hover:bg-accent/10"
                  : "text-muted-foreground opacity-75 hover:opacity-90"
              }`}
              whileHover={{
                scale: status === "authenticated" ? 1.05 : 1.02,
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {status === "unauthenticated"
                ? "登录以查看更多"
                : `加载更多提示词 (${
                    filteredPrompts.length - displayCount
                  } 个剩余)`}
            </motion.button>
          </motion.div>
        )}

        {/* 空状态 */}
        {filteredPrompts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center"
          >
            <div className="glass-effect mx-auto max-w-md rounded-2xl p-12">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                未找到匹配的提示词
              </h3>
              <p className="text-gray-400">尝试调整搜索条件或浏览其他分类</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
