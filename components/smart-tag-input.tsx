"use client"

import React, { KeyboardEvent, useState, useRef, useEffect } from "react"
import { Plus, X, Hash, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EnhancedTag } from "@/components/enhanced-tag"
import { type TagType } from "@/lib/enhanced-tag-system"

interface SmartTag {
  id: string
  name: string
  type?: TagType
  isCustom?: boolean
}

interface SmartTagInputProps {
  tags: SmartTag[]
  onTagsChange: (tags: SmartTag[]) => void
  placeholder?: string
  maxTags?: number
  className?: string
  allowCustomTags?: boolean
  suggestedTags?: SmartTag[]
  onCreateCustomTag?: (tagName: string) => SmartTag
}

// 预定义的标签建议
const defaultSuggestedTags: SmartTag[] = [
  { id: "content", name: "内容创作", type: "content" },
  { id: "community", name: "社区讨论", type: "community" },
  { id: "tech", name: "技术分享", type: "category" },
  { id: "ai", name: "AI技能", type: "skill" },
  { id: "featured", name: "精选推荐", type: "featured" },
  { id: "hot", name: "热门话题", type: "hot" },
  { id: "new", name: "最新发布", type: "new" },
  { id: "beginner", name: "新手友好", type: "difficulty" },
  { id: "advanced", name: "高级技巧", type: "difficulty" },
  { id: "tutorial", name: "教程指南", type: "category" },
]

export function SmartTagInput({
  tags,
  onTagsChange,
  placeholder = "输入标签名称...",
  maxTags = 10,
  className,
  allowCustomTags = true,
  suggestedTags = defaultSuggestedTags,
  onCreateCustomTag
}: SmartTagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<SmartTag[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // 过滤建议标签
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestedTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some((existingTag) => existingTag.id === tag.id)
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setFilteredSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue, suggestedTags, tags])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const addTag = (suggestedTag?: SmartTag) => {
    if (tags.length >= maxTags) return

    let newTag: SmartTag

    if (suggestedTag) {
      newTag = suggestedTag
    } else {
      const trimmedValue = inputValue.trim()
      if (!trimmedValue) return

      // 检查是否已存在
      if (tags.some((tag) => tag.name.toLowerCase() === trimmedValue.toLowerCase())) {
        return
      }

      // 创建自定义标签
      if (allowCustomTags) {
        if (onCreateCustomTag) {
          newTag = onCreateCustomTag(trimmedValue)
        } else {
          newTag = {
            id: `custom-${Date.now()}`,
            name: trimmedValue,
            type: "default",
            isCustom: true
          }
        }
      } else {
        return
      }
    }

    onTagsChange([...tags, newTag])
    setInputValue("")
    setShowSuggestions(false)
  }

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    onTagsChange(newTags)
  }

  const handleSuggestionClick = (tag: SmartTag) => {
    addTag(tag)
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* 输入区域 */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue && setShowSuggestions(filteredSuggestions.length > 0)}
              placeholder={placeholder}
              className="pr-10"
            />
            {inputValue && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => addTag()}
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8 p-0 hover:bg-primary/20"
              >
                <Plus className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 建议标签下拉 */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover p-2 shadow-lg"
            >
              <div className="space-y-1">
                {filteredSuggestions.map((tag) => (
                  <motion.button
                    key={tag.id}
                    onClick={() => handleSuggestionClick(tag)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Hash className="size-3 text-muted-foreground" />
                    <span>{tag.name}</span>
                    {tag.type && tag.type !== "default" && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {tag.type}
                      </Badge>
                    )}
                  </motion.button>
                ))}
                
                {allowCustomTags && inputValue.trim() && (
                  <motion.button
                    onClick={() => addTag()}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent border-t border-border"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="size-3 text-primary" />
                    <span>创建自定义标签: "{inputValue.trim()}"</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 已选标签显示 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {tags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <EnhancedTag
                  type={tag.type || "default"}
                  variant="solid"
                  size="sm"
                  removable
                  onRemove={() => removeTag(index)}
                  className={tag.isCustom ? "ring-1 ring-primary/30" : ""}
                >
                  {tag.isCustom && <Sparkles className="size-3 mr-1" />}
                  {tag.name}
                </EnhancedTag>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 状态信息 */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{tags.length}/{maxTags} 个标签</span>
        {tags.length >= maxTags && (
          <span className="text-orange-500">已达到最大标签数量</span>
        )}
      </div>

      {/* 使用提示 */}
      <div className="text-xs text-muted-foreground">
        💡 提示：输入标签名称查看建议，按回车键或点击加号添加标签
      </div>
    </div>
  )
}
