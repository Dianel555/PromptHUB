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

  // 智能标签颜色分配
  const getTagColor = (tagName: string) => {
    const colors = [
      "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50",
      "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50", 
      "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50",
      "bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50",
      "bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/50",
      "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
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
          </div>
        </CardHeader>

        <CardContent className="relative flex h-full flex-col p-6 pb-4">
          {/* 描述 */}
          <div className="flex-1 mb-4">
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mt-auto">
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
        </CardContent>
      </Card>
    </motion.div>
  )
}