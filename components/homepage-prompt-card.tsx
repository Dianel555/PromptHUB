"use client"

import React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"

interface HomepagePromptCardProps {
  id: string | number
  title: string
  description: string
  tags: string[]
  className?: string
  onClick?: () => void
}

export function HomepagePromptCard({
  id,
  title,
  description,
  tags,
  className = "",
  onClick
}: HomepagePromptCardProps) {

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

  // 智能标签颜色分配 - 优化hover效果确保文本可读性
  const getTagColor = (tagName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 hover:bg-blue-150 hover:text-blue-900 hover:shadow-sm dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-800/60 dark:hover:text-blue-100",
      "bg-green-100 text-green-800 hover:bg-green-150 hover:text-green-900 hover:shadow-sm dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-800/60 dark:hover:text-green-100", 
      "bg-purple-100 text-purple-800 hover:bg-purple-150 hover:text-purple-900 hover:shadow-sm dark:bg-purple-900/50 dark:text-purple-200 dark:hover:bg-purple-800/60 dark:hover:text-purple-100",
      "bg-orange-100 text-orange-800 hover:bg-orange-150 hover:text-orange-900 hover:shadow-sm dark:bg-orange-900/50 dark:text-orange-200 dark:hover:bg-orange-800/60 dark:hover:text-orange-100",
      "bg-pink-100 text-pink-800 hover:bg-pink-150 hover:text-pink-900 hover:shadow-sm dark:bg-pink-900/50 dark:text-pink-200 dark:hover:bg-pink-800/60 dark:hover:text-pink-100",
      "bg-indigo-100 text-indigo-800 hover:bg-indigo-150 hover:text-indigo-900 hover:shadow-sm dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-800/60 dark:hover:text-indigo-100"
    ]
    const hash = tagName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("", className)}
    >
      <Card 
        className="group relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 h-[280px] flex flex-col"
        onClick={handleCardClick}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <CardHeader className="relative pb-1 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors min-h-[2.5rem] leading-tight">
                {title}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative px-6 pt-1 pb-3 flex-1 flex flex-col">
          {/* 描述 - 缩短间距 */}
          <div className="mb-2 flex-1">
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed min-h-[3.5rem]">
              {description}
            </p>
          </div>

          {/* 标签 - 优化响应式布局和可见性 */}
          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border/20 min-h-[36px] flex-shrink-0 pb-1 mt-auto">
            {tags && tags.length > 0 ? (
              <>
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    className={`text-xs font-medium px-2 py-1 ${getTagColor(tag)}`}
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="outline" className="text-xs font-medium px-2 py-1 border-border/40 text-muted-foreground">
                    +{tags.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground">暂无标签</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}