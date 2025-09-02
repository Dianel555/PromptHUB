"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Star,
  Copy,
  ExternalLink,
  User,
  Calendar,
  Eye,
  Edit,
  FileText,
  Share2,
  Download
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
  const { data: session } = useSession()
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [favorited, setFavorited] = useState(false)

  // 使用当前用户会话数据作为头像来源
  const displayAvatar = isOwner && session?.user?.image 
    ? session.user.image 
    : author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author.name)}`
  
  const displayName = isOwner && session?.user?.name 
    ? session.user.name 
    : author.name

  const handleCardClick = () => {
    if (onClick) {
      onClick()
      return
    }
    // 统一跳转到详情页面，编辑功能通过详情页面的编辑按钮实现
    router.push(`/prompts/${id}`)
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!content) {
      toast.error("没有可复制的内容")
      return
    }

    try {
      // 复制完整的JSON格式数据
      const promptData = {
        title,
        description,
        content,
        tags,
        author: author.name,
        createdAt: formatDate(createdAt)
      }
      await navigator.clipboard.writeText(JSON.stringify(promptData, null, 2))
      toast.success("提示词JSON数据已复制到剪贴板")
    } catch (error) {
      console.error("复制失败:", error)
      toast.error("复制失败，请手动复制")
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const shareUrl = `${window.location.origin}/prompts/${id}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success("分享链接已复制到剪贴板")
    } catch (error) {
      console.error("分享失败:", error)
      toast.error("分享失败")
    }
  }

  const handleExportJSON = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const promptData = {
        title,
        description,
        content,
        tags,
        author: author.name,
        createdAt: formatDate(createdAt),
        likes,
        views,
        comments
      }
      
      const dataStr = JSON.stringify(promptData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success("JSON文件已下载")
    } catch (error) {
      console.error("导出失败:", error)
      toast.error("导出失败")
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

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const newFavoritedState = !favorited
    setFavorited(newFavoritedState)
    
    // 调用存储系统更新收藏状态
    try {
      const { toggleFavorite } = require("@/lib/prompt-storage")
      toggleFavorite(id.toString(), newFavoritedState)
      
      console.log(`${newFavoritedState ? "收藏" : "取消收藏"} 提示词:`, id)
    } catch (error) {
      console.error("更新收藏状态失败:", error)
      // 回滚状态
      setFavorited(favorited)
    }
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 统一跳转到标准个人主页路由
    router.push('/profile')
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
                  "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 dark:hover:text-blue-200",
                  "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 dark:hover:text-green-200",
                  "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50 dark:hover:text-purple-200",
                  "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-800/50 dark:hover:text-orange-200",
                  "bg-pink-100 text-pink-800 hover:bg-pink-200 hover:text-pink-900 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-800/50 dark:hover:text-pink-200",
                  "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50 dark:hover:text-indigo-200"
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

          {/* 作者信息 - 修复头像显示和点击跳转 */}
          <div className="mb-4 flex items-center space-x-2">
            <Avatar 
              className="size-6 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              onClick={handleAuthorClick}
            >
              <AvatarImage 
                src={displayAvatar} 
                alt={displayName}
              />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button 
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              onClick={handleAuthorClick}
            >
              {displayName}
            </button>
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

            <motion.button
              className={`flex items-center space-x-1 transition-colors duration-300 ${
                favorited 
                  ? "text-yellow-500 hover:text-yellow-600" 
                  : "hover:text-yellow-500"
              }`}
              onClick={handleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className={`size-4 ${favorited ? "fill-current" : ""}`} />
            </motion.button>

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
                  title="复制JSON数据"
                >
                  <Copy className="size-4" />
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
                className="size-8 p-0 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                title="分享链接"
              >
                <Share2 className="size-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleExportJSON}
                className="size-8 p-0 hover:bg-green-500/20 text-green-600 dark:text-green-400"
                title="导出JSON"
              >
                <Download className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}