"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Heart, 
  MessageCircle, 
  Copy, 
  ExternalLink, 
  User,
  Calendar,
  Eye
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"

interface HomepagePromptCardProps {
  id: string | number
  title: string
  description: string
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

export function HomepagePromptCard({
  id,
  title,
  description,
  author,
  tags,
  likes,
  comments = 0,
  views = 0,
  createdAt,
  isLiked = false,
  className = "",
  onClick
}: HomepagePromptCardProps) {
  const router = useRouter()

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(`${title}\n\n${description}`)
      toast.success("已复制到剪贴板")
    } catch (error) {
      toast.error("复制失败")
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      // 对于演示卡片，显示预览模态框而不是跳转
      toast.info("这是演示提示词", {
        description: "点击右上角的登录按钮来创建您自己的提示词"
      })
    }
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (author.id) {
      router.push(`/profile/${author.id}`)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("h-full", className)}
    >
      <Card 
        className="group relative h-full cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20"
        onClick={handleCardClick}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="size-8 p-0 hover:bg-primary/20"
                title="复制内容"
              >
                <Copy className="size-4" />
              </Button>
              
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
        </CardHeader>

        <CardContent className="relative flex h-full flex-col justify-between space-y-4 pt-0">
          {/* 描述 - 缩小高度确保底部信息可见 */}
          <div className="flex-1">
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                className={`text-xs border-0 hover:scale-105 transition-all cursor-pointer ${getTagColor(tag)}`}
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs hover:bg-muted/50 transition-colors">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 底部信息 - 修复截断问题 */}
          <div className="space-y-3 pt-4 mt-4 border-t border-border/30">
            {/* 作者和统计信息 - 修复头像显示和布局 */}
            <div className="flex items-center justify-between text-sm min-h-[20px]">
              <button
                onClick={handleAuthorClick}
                className="flex min-w-0 flex-1 items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mr-4"
              >
                {author.avatar ? (
                  <img 
                    src={author.avatar} 
                    alt={author.name}
                    className="size-5 rounded-full shrink-0 object-cover"
                    onError={(e) => {
                      // 头像加载失败时显示默认图标
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const icon = document.createElement('div')
                        icon.className = 'size-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary'
                        icon.textContent = author.name.charAt(0).toUpperCase()
                        parent.insertBefore(icon, target)
                      }
                    }}
                  />
                ) : (
                  <div className="size-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="truncate text-sm">{author.name}</span>
              </button>
              
              <div className="flex shrink-0 items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Heart className={cn("size-4", isLiked && "fill-red-500 text-red-500")} />
                  <span className="text-xs">{likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="size-4" />
                  <span className="text-xs">{views}</span>
                </div>
              </div>
            </div>

            {/* 创建时间 */}
            <div className="flex items-center space-x-1 text-xs text-muted-foreground pb-2">
              <Calendar className="size-3" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
