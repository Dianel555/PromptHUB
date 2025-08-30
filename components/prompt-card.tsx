"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
  Eye
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
  className?: string
  onClick?: () => void
}

export default function PromptCard({
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
  className = "",
  onClick
}: PromptCardProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)

  const handleCardClick = () => {
    if (onClick) {
      onClick()
      return
    }
    // 跳转到提示词详情页面
    router.push(`/prompts/${id}`)
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
    
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))

    // TODO: 调用API更新点赞状态
    console.log(`${liked ? "取消点赞" : "点赞"} 提示词:`, id)
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (author.id) {
      router.push(`/profile/${author.id}`)
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
          </div>

          {/* 标签 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 作者信息 */}
          <div className="mb-4 flex items-center space-x-2">
            <Avatar 
              className="size-6 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              onClick={handleAuthorClick}
            >
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="text-xs">
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
                >
                  <Copy className="size-4" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCardClick}
                className="size-8 p-0 hover:bg-primary/20"
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