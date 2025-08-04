"use client"

import { useTheme } from "next-themes"

import { getTagColorIndex, getTagColorsForTheme } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ColorfulTagProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function ColorfulTag({
  children,
  className,
  variant = "default",
}: ColorfulTagProps) {
  const { theme } = useTheme()
  const text = typeof children === "string" ? children : ""
  const colorIndex = getTagColorIndex(text)

  // 根据当前主题获取对应的颜色配置
  const colors = getTagColorsForTheme(theme || "light")
  const colorConfig = colors[colorIndex]

  if (variant !== "default") {
    return (
      <Badge variant={variant} className={className}>
        {children}
      </Badge>
    )
  }

  return (
    <Badge
      className={cn(
        "border px-2.5 py-1 font-medium shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-md",
        colorConfig.bg,
        colorConfig.text,
        colorConfig.border,
        colorConfig.shadow,
        className
      )}
    >
      {children}
    </Badge>
  )
}

interface TagListProps {
  tags: string[]
  className?: string
  tagClassName?: string
}

export function TagList({ tags, className, tagClassName }: TagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag, index) => (
        <ColorfulTag key={index} className={tagClassName}>
          {tag}
        </ColorfulTag>
      ))}
    </div>
  )
}
