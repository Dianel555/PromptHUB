"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, Heart, Tag, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

import { TagType } from "@/lib/enhanced-tag-system"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { EnhancedTagList } from "@/components/enhanced-tag"

interface PromptCardProps {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  likes: number
  views: number
  featured?: boolean
}

// 根据标签名称推断标签类型
function getTagTypeFromName(tagName: string): TagType {
  const lowerTag = tagName.toLowerCase()

  if (
    lowerTag.includes("内容") ||
    lowerTag.includes("创作") ||
    lowerTag.includes("写作")
  )
    return "content"
  if (
    lowerTag.includes("社区") ||
    lowerTag.includes("讨论") ||
    lowerTag.includes("交流")
  )
    return "community"
  if (
    lowerTag.includes("技能") ||
    lowerTag.includes("能力") ||
    lowerTag.includes("skill")
  )
    return "skill"
  if (
    lowerTag.includes("难度") ||
    lowerTag.includes("高级") ||
    lowerTag.includes("困难")
  )
    return "difficulty"
  if (
    lowerTag.includes("精选") ||
    lowerTag.includes("推荐") ||
    lowerTag.includes("featured")
  )
    return "featured"
  if (
    lowerTag.includes("热门") ||
    lowerTag.includes("流行") ||
    lowerTag.includes("hot")
  )
    return "hot"
  if (
    lowerTag.includes("新") ||
    lowerTag.includes("最新") ||
    lowerTag.includes("new")
  )
    return "new"
  if (
    lowerTag.includes("分类") ||
    lowerTag.includes("类别") ||
    lowerTag.includes("category")
  )
    return "category"

  return "default"
}

export function PromptCard({
  id,
  title,
  description,
  author,
  tags,
  likes,
  views,
  featured = false,
}: PromptCardProps) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const { data: session, status } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)

  // 检测当前是否为深色模式
  const isDark = resolvedTheme === "dark"

  const handleCardClick = () => {
    // 检查用户是否已登录
    if (status === "unauthenticated") {
      router.push(
        "/auth/signin?callbackUrl=" + encodeURIComponent(`/prompts/${id}`)
      )
      return
    }
    // 跳转到提示词详情页面
    router.push(`/prompts/${id}`)
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡

    // 检查用户是否已登录
    if (status === "unauthenticated") {
      router.push(
        "/auth/signin?callbackUrl=" +
          encodeURIComponent(window.location.pathname)
      )
      return
    }

    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))

    // TODO: 调用API更新点赞状态
    console.log(`${isLiked ? "取消点赞" : "点赞"} 提示词:`, id)
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡

    // 检查用户是否已登录
    if (status === "unauthenticated") {
      router.push(
        "/auth/signin?callbackUrl=" +
          encodeURIComponent(`/users/${author.name}`)
      )
      return
    }

    // 跳转到作者页面
    router.push(`/users/${author.name}`)
  }
  const isAuthenticated = status === "authenticated"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        isAuthenticated
          ? {
              y: -8,
              scale: 1.02,
              rotateX: 5,
              rotateY: 5,
            }
          : {
              scale: 1.01,
            }
      }
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className={`perspective-1000 group cursor-pointer ${
        !isAuthenticated ? "opacity-75 hover:opacity-90" : ""
      }`}
      onClick={handleCardClick}
    >
      <Card
        className={`
        relative flex h-full min-h-[300px] flex-col overflow-hidden border-0 
        bg-gradient-to-br from-white/10 to-white/5 shadow-xl backdrop-blur-md
        transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 
        before:to-cyan-500/10 before:opacity-0 before:transition-opacity
        before:duration-300 hover:shadow-2xl hover:before:opacity-100
        ${featured ? "shadow-purple-500/20 ring-2 ring-purple-500/50" : ""}
      `}
      >
        {/* 发光边框效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

        {/* 内容区域 */}
        <div className="relative flex flex-1 flex-col space-y-4 p-6">
          {/* 标题和特色标识 */}
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-purple-400">
              {title}
            </h3>
            {featured && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2 shrink-0"
              >
                <Badge className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-pink-600">
                  精选
                </Badge>
              </motion.div>
            )}
          </div>

          {/* 描述 */}
          <div className="flex-1">
            <p className="line-clamp-3 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              {description}
            </p>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            <EnhancedTagList
              tags={tags.slice(0, 3).map((tag, index) => ({
                id: `${id}-${index}`,
                name: tag,
                type: getTagTypeFromName(tag),
              }))}
              variant="solid"
              size="sm"
              animated={true}
              onTagClick={(tagId) => {
                const tagName = tags.find(
                  (_, index) => `${id}-${index}` === tagId
                )
                if (status === "unauthenticated") {
                  router.push(
                    "/auth/signin?callbackUrl=" +
                      encodeURIComponent(window.location.pathname)
                  )
                  return
                }
                // 跳转到标签页面
                if (tagName) {
                  router.push(`/tags/${tagName}`)
                }
              }}
            />
            {tags.length > 3 && (
              <Badge
                variant="secondary"
                className="border-border bg-accent/10 text-muted-foreground"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 底部信息 */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            {/* 作者信息 */}
            <div
              className="flex cursor-pointer items-center space-x-2 transition-opacity hover:opacity-80"
              onClick={handleAuthorClick}
            >
              <Avatar className="size-6">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-xs text-white">
                  {author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                {author.name}
              </span>
            </div>

            {/* 统计信息 */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <motion.button
                className={`flex items-center space-x-1 transition-colors duration-300 ${
                  isLiked ? "text-red-500" : "hover:text-red-400"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLikeClick}
              >
                <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likeCount}</span>
              </motion.button>
              <motion.div
                className="flex items-center space-x-1 transition-colors duration-300 group-hover:text-blue-400"
                whileHover={{ scale: 1.1 }}
              >
                <Eye className="size-4" />
                <span>{views}</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 点击涟漪效果 */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0"
          whileTap={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  )
}
