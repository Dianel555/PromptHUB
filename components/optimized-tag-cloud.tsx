"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Filter, Hash, Search, Tag, TrendingUp, X } from "lucide-react"

import { getTagConfig } from "@/lib/tag-config"
import { tagDimensions } from "@/lib/tag-system"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export interface TagCloudItem {
  id: string
  name: string
  count: number
  dimension: string
  color?: string
  lastUsed?: Date
}

interface OptimizedTagCloudProps {
  tags: TagCloudItem[]
  onTagClick?: (tag: TagCloudItem) => void
  onTagRemove?: (tagId: string) => void
  showSearch?: boolean
  showFilter?: boolean
  showStats?: boolean
  maxDisplayTags?: number
  language?: "zh" | "en"
  className?: string
}

// 标签排序选项
const SORT_OPTIONS = {
  frequency: { zh: "使用频率", en: "Frequency" },
  alphabetical: { zh: "字母顺序", en: "Alphabetical" },
  recent: { zh: "最近使用", en: "Recent" },
  dimension: { zh: "维度分组", en: "By Dimension" },
}

// 标签云动画变体
const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.05,
    y: -2,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
  },
}

export function OptimizedTagCloud({
  tags,
  onTagClick,
  onTagRemove,
  showSearch = true,
  showFilter = true,
  showStats = true,
  maxDisplayTags,
  language = "zh",
  className,
}: OptimizedTagCloudProps) {
  const config = getTagConfig()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<keyof typeof SORT_OPTIONS>("frequency")
  const [filterDimension, setFilterDimension] = useState<string>("all")
  const [showAll, setShowAll] = useState(false)

  // 计算标签统计信息
  const tagStats = useMemo(() => {
    const totalTags = tags.length
    const totalUsage = tags.reduce((sum, tag) => sum + tag.count, 0)
    const avgUsage = totalTags > 0 ? Math.round(totalUsage / totalTags) : 0
    const mostUsedTag = tags.reduce(
      (max, tag) => (tag.count > max.count ? tag : max),
      tags[0] || { count: 0 }
    )

    const dimensionStats = tagDimensions
      .map((dimension) => ({
        dimension: dimension.id,
        name: language === "zh" ? dimension.name : dimension.nameEn,
        count: tags.filter((tag) => tag.dimension === dimension.id).length,
        color: dimension.color,
      }))
      .filter((stat) => stat.count > 0)

    return {
      totalTags,
      totalUsage,
      avgUsage,
      mostUsedTag,
      dimensionStats,
    }
  }, [tags, language])

  // 过滤和排序标签
  const processedTags = useMemo(() => {
    let filtered = tags

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(query) ||
          tag.dimension.toLowerCase().includes(query)
      )
    }

    // 维度过滤
    if (filterDimension !== "all") {
      filtered = filtered.filter((tag) => tag.dimension === filterDimension)
    }

    // 排序
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "frequency":
          return b.count - a.count
        case "alphabetical":
          return a.name.localeCompare(b.name)
        case "recent":
          if (!a.lastUsed || !b.lastUsed) return 0
          return b.lastUsed.getTime() - a.lastUsed.getTime()
        case "dimension":
          return a.dimension.localeCompare(b.dimension)
        default:
          return 0
      }
    })

    return sorted
  }, [tags, searchQuery, filterDimension, sortBy])

  // 显示的标签（支持分页）
  const displayTags = useMemo(() => {
    if (!maxDisplayTags || showAll) return processedTags
    return processedTags.slice(0, maxDisplayTags)
  }, [processedTags, maxDisplayTags, showAll])

  // 计算标签字体大小
  const getTagFontSize = useCallback(
    (count: number) => {
      if (tags.length === 0) return config.minFontSize

      const maxCount = Math.max(...tags.map((t) => t.count))
      const minCount = Math.min(...tags.map((t) => t.count))
      const range = maxCount - minCount || 1

      const sizeRange = config.maxFontSize - config.minFontSize
      const normalizedCount = (count - minCount) / range

      return Math.round(config.minFontSize + normalizedCount * sizeRange)
    },
    [tags, config]
  )

  // 获取维度信息
  const getDimensionInfo = useCallback((dimensionId: string) => {
    return tagDimensions.find((d) => d.id === dimensionId)
  }, [])

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery("")
  }

  // 渲染标签项
  const renderTag = (tag: TagCloudItem) => {
    const dimensionInfo = getDimensionInfo(tag.dimension)
    const fontSize = getTagFontSize(tag.count)

    return (
      <motion.div
        key={tag.id}
        variants={tagVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        className="inline-block"
      >
        <Badge
          variant="secondary"
          className={cn(
            "m-1 flex cursor-pointer items-center gap-1 px-3 py-1.5 transition-all duration-200 hover:shadow-md",
            onTagClick && "hover:border-blue-300 hover:bg-blue-100"
          )}
          style={{
            fontSize: `${fontSize}px`,
            backgroundColor: tag.color || dimensionInfo?.color + "20",
            borderColor: tag.color || dimensionInfo?.color,
            color: tag.color || dimensionInfo?.color,
          }}
          onClick={() => onTagClick?.(tag)}
        >
          <Tag className="size-3" />
          <span className="font-medium">{tag.name}</span>
          <span className="text-xs opacity-70">({tag.count})</span>
          {onTagRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTagRemove(tag.id)
              }}
              className="ml-1 rounded-full p-0.5 transition-colors hover:bg-red-200"
              title={language === "zh" ? "移除标签" : "Remove tag"}
            >
              <X className="size-3" />
            </button>
          )}
        </Badge>
      </motion.div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 统计信息 */}
      {showStats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="size-5 text-green-600" />
              {language === "zh" ? "标签统计" : "Tag Statistics"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tagStats.totalTags}
                </div>
                <div className="text-gray-600">
                  {language === "zh" ? "总标签数" : "Total Tags"}
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tagStats.totalUsage}
                </div>
                <div className="text-gray-600">
                  {language === "zh" ? "总使用次数" : "Total Usage"}
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {tagStats.avgUsage}
                </div>
                <div className="text-gray-600">
                  {language === "zh" ? "平均使用" : "Avg Usage"}
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 text-center">
                <div className="truncate text-lg font-bold text-purple-600">
                  {tagStats.mostUsedTag?.name || "-"}
                </div>
                <div className="text-gray-600">
                  {language === "zh" ? "最热标签" : "Top Tag"}
                </div>
              </div>
            </div>

            {/* 维度分布 */}
            {tagStats.dimensionStats.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">
                  {language === "zh" ? "维度分布" : "Dimension Distribution"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tagStats.dimensionStats.map((stat) => (
                    <Badge
                      key={stat.dimension}
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: stat.color, color: stat.color }}
                    >
                      {stat.name} ({stat.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 搜索和过滤控件 */}
      {(showSearch || showFilter) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* 搜索框 */}
              {showSearch && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={
                      language === "zh" ? "搜索标签..." : "Search tags..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              )}

              {/* 过滤和排序 */}
              {showFilter && (
                <div className="flex gap-2">
                  <Select
                    value={filterDimension}
                    onValueChange={setFilterDimension}
                  >
                    <SelectTrigger className="w-32">
                      <Filter className="mr-2 size-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "zh" ? "全部维度" : "All Dimensions"}
                      </SelectItem>
                      {tagDimensions.map((dimension) => (
                        <SelectItem key={dimension.id} value={dimension.id}>
                          {language === "zh"
                            ? dimension.name
                            : dimension.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={sortBy}
                    onValueChange={(value) =>
                      setSortBy(value as keyof typeof SORT_OPTIONS)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <Hash className="mr-2 size-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {language === "zh" ? label.zh : label.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 标签云展示 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="size-5 text-blue-600" />
              {language === "zh" ? "标签云" : "Tag Cloud"}
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {displayTags.length} / {processedTags.length}
            </Badge>
          </div>
          <CardDescription>
            {language === "zh"
              ? "点击标签进行交互，标签大小反映使用频率"
              : "Click tags to interact, size reflects usage frequency"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayTags.length > 0 ? (
            <div className="min-h-[120px]">
              <div className="flex flex-wrap items-center justify-center gap-1">
                <AnimatePresence>
                  {displayTags.map((tag) => renderTag(tag))}
                </AnimatePresence>
              </div>

              {/* 显示更多按钮 */}
              {maxDisplayTags && processedTags.length > maxDisplayTags && (
                <>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAll(!showAll)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {showAll
                        ? language === "zh"
                          ? "收起标签"
                          : "Show Less"
                        : language === "zh"
                        ? `显示更多 (+${processedTags.length - maxDisplayTags})`
                        : `Show More (+${
                            processedTags.length - maxDisplayTags
                          })`}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Tag className="mx-auto mb-3 size-12 text-gray-300" />
              <p className="mb-2 text-gray-500">
                {searchQuery || filterDimension !== "all"
                  ? language === "zh"
                    ? "没有找到匹配的标签"
                    : "No matching tags found"
                  : language === "zh"
                  ? "暂无标签数据"
                  : "No tags available"}
              </p>
              {(searchQuery || filterDimension !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterDimension("all")
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {language === "zh" ? "清除筛选条件" : "Clear Filters"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}