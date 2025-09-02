"use client"

import React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"

interface DebugPromptCardProps {
  id: string | number
  title: string
  description: string
  tags: string[]
  className?: string
  onClick?: () => void
}

export function DebugPromptCard({
  id,
  title,
  description,
  tags,
  className = "",
  onClick
}: DebugPromptCardProps) {

  // 调试日志
  console.log('DebugPromptCard render:', { id, title, tags })

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      toast.info("这是演示提示词", {
        description: "点击右上角的登录按钮来创建您自己的提示词"
      })
    }
  }

  // 简化的标签颜色
  const getTagColor = (tagName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800", 
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800"
    ]
    const hash = tagName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className={cn("h-full", className)}>
      <Card className="group relative h-full cursor-pointer border transition-all duration-300 hover:shadow-lg">
        
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 描述 */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>

          {/* 调试信息 */}
          <div className="text-xs text-red-500 border border-red-200 p-2 rounded">
            调试: tags数量={tags?.length || 0}, tags={JSON.stringify(tags)}
          </div>

          {/* 标签区域 */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500">标签区域:</div>
            <div className="flex flex-wrap gap-2 p-2 border border-dashed border-gray-300 min-h-[40px]">
              {tags && tags.length > 0 ? (
                tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    className={`text-xs font-medium px-2 py-1 ${getTagColor(tag)}`}
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-red-500">无标签数据</span>
              )}
              {tags && tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}