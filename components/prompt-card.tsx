"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  MessageCircle,
  Copy,
  ExternalLink,
  User,
  Calendar,
  Eye,
  Edit,
  FileText
} from "lucide-react"
import { toast } from "sonner"

interface PromptCardProps {
  id: string | number
  title: string
  description: string
  content?: string
  author: {
    name: string
    avatar?: string
    id?: string
  }
  tags: string[]
  likes: number
  comments?: number
  views?: number
  createdAt: Date | string
  isLiked?: boolean
  isOwner?: boolean
  className?: string
  onClick?: () => void
  onEdit?: () => void
  showPreview?: boolean
}

export function PromptCard({
  id,
  title,
  description,
  content,
  author,
  tags,
  likes,
  comments = 0,
  views = 0,
  createdAt,
  isLiked = false,
  isOwner = false,
  className = "",
  onClick,
  onEdit,
  showPreview = true
}: PromptCardProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)

  const handleCardClick = () => {
    if (onClick) {
      onClick()
      return
    }
    // 如果是用户自己的提示词，跳转到编辑页面；否则跳转到详情页面
    if (isOwner) {
      router.push(`/prompts/${id}/edit`)
    } else {
      router.push(`/prompts/${id}`)
    }
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!content) {
      toast.error("没有可复制的内容")
      return
    }

    try {
      await navigator.clipboard.writeText(content)
      toast.success("提示词已复制到剪贴板")
    } catch (error) {
      console.error("复制失败:", error)
      toast.error("复制失败，请手动复制")
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const newLikedState = !liked
    setLiked(newLikedState)
    
    // 调用存储系统更新点赞状态
    try {
      const { toggleLike } = require("@/lib/prompt-storage")
      const newLikeCount = toggleLike(id.toString(), newLikedState)
      setLikeCount(newLikeCount)
      
      console.log(`${newLikedState ? "点赞" : "取消点赞"} 提示词:`, id, "新点赞数:", newLikeCount)
    } catch (error) {
      console.error("更新点赞状态失败:", error)
      // 回滚状态
      setLiked(liked)
    }
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (author.id) {
      router.push(`/profile/${author.id}`)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit()
    } else {
      // 默认跳转到编辑页面
      router.push(`/prompts/${id}/edit`)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card 
        className="group h-full cursor-pointer overflow-hidden border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 hover:shadow-lg"
        onClick={handleCardClick}
      >
        <CardContent className="flex h-full flex-col p-6">
          {/* 标题和描述 */}
          <div className="mb-4 flex-1">
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* 内容预览 - 缩小高度确保底部信息可见 */}
            {showPreview && content && (
              <div className="mt-3 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10 p-3 border border-border/30">
                <div className="prose prose-sm max-w-none">
                  <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mb-0 font-mono">
                    {content.length > 100 ? `${content.substring(0, 100)}...` : content}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 智能标签 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => {
              // 智能标签颜色分配
              const getTagColor = (tagName: string) => {
                const colors = [
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                  "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
                  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                ]
                const hash = tagName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
                return colors[hash % colors.length]
              }

              return (
                <Badge
                  key={index}
                  className={`text-xs border-0 hover:scale-105 transition-all cursor-pointer ${getTagColor(tag)}`}
                >
                  {tag}
                </Badge>
              )
            })}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs hover:bg-muted/50 transition-colors">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 作者信息 - 修复头像显示 */}
          <div className="mb-4 flex items-center space-x-2">
            <Avatar 
              className="size-6 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              onClick={handleAuthorClick}
            >
              <AvatarImage 
                src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`} 
                alt={author.name}
                onError={(e) => {
                  // 头像加载失败时的处理
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span 
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              onClick={handleAuthorClick}
            >
              {author.name}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <motion.button
              className={`flex items-center space-x-1 transition-colors duration-300 ${
                liked 
                  ? "text-red-500 hover:text-red-600" 
                  : "hover:text-red-500"
              }`}
              onClick={handleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </motion.button>

            <div className="flex items-center space-x-1 text-gray-400">
              <MessageCircle className="size-4" />
              <span>{comments}</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-400">
              <Eye className="size-4" />
              <span>{views}</span>
            </div>

            <div className="flex-1" />

            {/* 操作按钮 */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {content && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="size-8 p-0 hover:bg-primary/20"
                  title="复制内容"
                >
                  <Copy className="size-4" />
                </Button>
              )}

              {isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="size-8 p-0 hover:bg-green-500/20 text-green-600 dark:text-green-400"
                  title="编辑提示词"
                >
                  <Edit className="size-4" />
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={handleCardClick}
                className="size-8 p-0 hover:bg-primary/20"
                title="查看详情"
              >
                <ExternalLink className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}