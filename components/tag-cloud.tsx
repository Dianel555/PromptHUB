"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface TagCloudItem {
  name: string
  weight: number
  category: string
}

interface TagCloudProps {
  tags: TagCloudItem[]
  language: "zh" | "en"
  maxTags?: number
  className?: string
}

export function TagCloud({
  tags,
  language,
  maxTags = 20,
  className,
}: TagCloudProps) {
  // 按权重排序并限制数量
  const sortedTags = tags.sort((a, b) => b.weight - a.weight).slice(0, maxTags)

  // 根据权重计算字体大小
  const getFontSize = (weight: number) => {
    if (weight >= 0.8) return "text-lg"
    if (weight >= 0.6) return "text-base"
    return "text-sm"
  }

  // 根据分类获取颜色
  const getCategoryColor = (category: string) => {
    const colors = {
      genre: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      mood: "bg-green-100 text-green-800 hover:bg-green-200",
      scene: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      style: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      action: "bg-red-100 text-red-800 hover:bg-red-200",
      default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  if (tags.length === 0) {
    return (
      <div className={cn("py-8 text-center text-gray-500", className)}>
        {language === "zh" ? "暂无标签数据" : "No tags available"}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap justify-center gap-3">
        {sortedTags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={cn(
              "cursor-pointer transition-all duration-200",
              getFontSize(tag.weight),
              getCategoryColor(tag.category),
              "hover:scale-105 hover:shadow-md"
            )}
            style={{
              opacity: 0.6 + tag.weight * 0.4, // 根据权重调整透明度
            }}
          >
            {tag.name}
            <span className="ml-1 text-xs opacity-70">
              {Math.round(tag.weight * 100)}%
            </span>
          </Badge>
        ))}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="size-3 rounded bg-blue-100"></div>
          <span>{language === "zh" ? "体裁" : "Genre"}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded bg-green-100"></div>
          <span>{language === "zh" ? "情绪" : "Mood"}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded bg-purple-100"></div>
          <span>{language === "zh" ? "场景" : "Scene"}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded bg-orange-100"></div>
          <span>{language === "zh" ? "风格" : "Style"}</span>
        </div>
      </div>
    </div>
  )
}