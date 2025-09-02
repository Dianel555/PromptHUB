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

  // 智能标签颜色分配 - 增强可见性
  const getTagColor = (tagName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/70",
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/70", 
      "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:hover:bg-purple-900/70",
      "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-200 dark:hover:bg-orange-900/70",
      "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/50 dark:text-pink-200 dark:hover:bg-pink-900/70",
      "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-900/70"
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
        className="group relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20"
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
          </div>
        </CardHeader>

        <CardContent className="relative p-6 pb-4">
          {/* 描述 */}
          <div className="mb-4">
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* 标签 - 确保可见性 */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border/20 min-h-[32px]">
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