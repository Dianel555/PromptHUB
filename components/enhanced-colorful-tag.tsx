"use client"

import React from "react"
import {
  BookOpen,
  Heart,
  MapPin,
  Palette,
  Tag as TagIcon,
  X,
} from "lucide-react"

import { getTagColor, getTagIcon, tagDimensions } from "@/lib/tag-system"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EnhancedColorfulTagProps {
  children: React.ReactNode
  dimension?: string
  confidence?: number
  isManual?: boolean
  removable?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "secondary"
  language?: "zh" | "en"
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

const dimensionIcons = {
  BookOpen,
  Heart,
  MapPin,
  Palette,
  TagIcon,
}

const sizeClasses = {
  sm: "h-6 px-2 py-1 text-xs",
  md: "h-7 px-3 py-1.5 text-sm",
  lg: "h-8 px-4 py-2 text-base",
}

const iconSizes = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
}

export function EnhancedColorfulTag({
  children,
  dimension,
  confidence,
  isManual = false,
  removable = false,
  size = "md",
  variant = "default",
  language = "zh",
  onRemove,
  onClick,
  className,
}: EnhancedColorfulTagProps) {
  const dimensionInfo = dimension
    ? tagDimensions.find((d) => d.id === dimension)
    : null
  const color = dimensionInfo?.color || "#6B7280"
  const IconComponent = dimensionInfo
    ? dimensionIcons[dimensionInfo.icon as keyof typeof dimensionIcons] ||
      TagIcon
    : TagIcon

  const baseClasses = cn(
    "inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full font-medium transition-all duration-200",
    "hover:shadow-sm",
    sizeClasses[size],
    className
  )

  const getVariantClasses = () => {
    if (variant === "outline") {
      return cn(
        "border-2 bg-white hover:bg-gray-50",
        isManual ? "border-gray-300 text-gray-700" : ""
      )
    }

    if (variant === "secondary") {
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }

    // default variant
    if (isManual) {
      return "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-150"
    }

    return "text-white hover:opacity-90"
  }

  const tagStyle =
    variant === "default" && !isManual
      ? {
          backgroundColor: color,
          borderColor: color,
        }
      : variant === "outline" && !isManual
      ? {
          borderColor: color,
          color: color,
        }
      : {}

  const confidenceColor =
    confidence && confidence > 0.7
      ? "text-green-600"
      : confidence && confidence > 0.4
      ? "text-yellow-600"
      : "text-red-600"

  return (
    <Badge
      className={cn(baseClasses, getVariantClasses())}
      style={tagStyle}
      onClick={onClick}
    >
      {/* 维度图标 */}
      {dimensionInfo && (
        <IconComponent
          className={cn(iconSizes[size], "shrink-0")}
          style={variant === "outline" && !isManual ? { color } : {}}
        />
      )}

      {/* 手动标签图标 */}
      {isManual && (
        <TagIcon className={cn(iconSizes[size], "shrink-0 text-gray-500")} />
      )}

      {/* 标签文本 */}
      <span className="max-w-32 truncate">{children}</span>

      {/* 置信度显示 */}
      {confidence !== undefined && confidence > 0 && size !== "sm" && (
        <span className={cn("text-xs font-normal opacity-75", confidenceColor)}>
          {Math.round(confidence * 100)}%
        </span>
      )}

      {/* 移除按钮 */}
      {removable && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "ml-1 h-auto rounded-full p-0 hover:bg-black/10",
            size === "sm" ? "size-3" : size === "md" ? "size-4" : "size-5"
          )}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <X
            className={cn(
              size === "sm" ? "size-2" : size === "md" ? "size-3" : "size-3.5"
            )}
          />
        </Button>
      )}
    </Badge>
  )
}

// 标签列表组件
interface EnhancedTagListProps {
  tags: Array<{
    text: string
    dimension?: string
    confidence?: number
    isManual?: boolean
  }>
  removable?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "secondary"
  language?: "zh" | "en"
  maxDisplay?: number
  onTagRemove?: (index: number) => void
  onTagClick?: (tag: any, index: number) => void
  className?: string
}

export function EnhancedTagList({
  tags,
  removable = false,
  size = "md",
  variant = "default",
  language = "zh",
  maxDisplay,
  onTagRemove,
  onTagClick,
  className,
}: EnhancedTagListProps) {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags
  const remainingCount =
    maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayTags.map((tag, index) => (
        <EnhancedColorfulTag
          key={`${tag.text}-${index}`}
          dimension={tag.dimension}
          confidence={tag.confidence}
          isManual={tag.isManual}
          removable={removable}
          size={size}
          variant={variant}
          language={language}
          onRemove={onTagRemove ? () => onTagRemove(index) : undefined}
          onClick={onTagClick ? () => onTagClick(tag, index) : undefined}
        >
          {tag.text}
        </EnhancedColorfulTag>
      ))}

      {remainingCount > 0 && (
        <Badge
          variant="outline"
          className={cn("border-gray-300 text-gray-500", sizeClasses[size])}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}

// 维度标签组件 - 按维度分组显示标签
interface DimensionTagGroupProps {
  tags: Array<{
    text: string
    dimension: string
    confidence?: number
    isManual?: boolean
  }>
  language?: "zh" | "en"
  removable?: boolean
  onTagRemove?: (index: number) => void
  className?: string
}

export function DimensionTagGroup({
  tags,
  language = "zh",
  removable = false,
  onTagRemove,
  className,
}: DimensionTagGroupProps) {
  // 按维度分组
  const groupedTags = tags.reduce((groups, tag, index) => {
    const dimension = tag.dimension || "custom"
    if (!groups[dimension]) {
      groups[dimension] = []
    }
    groups[dimension].push({ ...tag, originalIndex: index })
    return groups
  }, {} as Record<string, Array<any>>)

  return (
    <div className={cn("space-y-3", className)}>
      {Object.entries(groupedTags).map(([dimensionId, dimensionTags]) => {
        const dimensionInfo = tagDimensions.find((d) => d.id === dimensionId)
        const dimensionName = dimensionInfo
          ? language === "zh"
            ? dimensionInfo.name
            : dimensionInfo.nameEn
          : language === "zh"
          ? "自定义"
          : "Custom"

        return (
          <div key={dimensionId} className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: dimensionInfo?.color || "#6B7280" }}
              />
              <span className="text-sm font-medium text-gray-700">
                {dimensionName}
              </span>
              <Badge variant="outline" className="text-xs">
                {dimensionTags.length}
              </Badge>
            </div>
            <div className="ml-4 flex flex-wrap gap-2">
              {dimensionTags.map((tag) => (
                <EnhancedColorfulTag
                  key={`${tag.text}-${tag.originalIndex}`}
                  dimension={tag.dimension}
                  confidence={tag.confidence}
                  isManual={tag.isManual}
                  removable={removable}
                  size="sm"
                  language={language}
                  onRemove={
                    onTagRemove
                      ? () => onTagRemove(tag.originalIndex)
                      : undefined
                  }
                >
                  {tag.text}
                </EnhancedColorfulTag>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
