"use client"

import React, { KeyboardEvent, useState } from "react"
import { Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  language: "zh" | "en"
  maxTags?: number
  className?: string
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder,
  language,
  maxTags = 20,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      // 当输入框为空且按下退格键时，删除最后一个标签
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedValue])
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    onTagsChange(newTags)
  }

  const defaultPlaceholder =
    language === "zh"
      ? "输入标签并按回车键添加..."
      : "Enter tags and press Enter to add..."

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || defaultPlaceholder}
            className="pr-10"
          />
          {inputValue && (
            <button
              onClick={addTag}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
            >
              <Plus className="size-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* 标签显示区域 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 pr-1 transition-colors hover:bg-gray-200"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(index)}
                className="rounded-full p-0.5 transition-colors hover:bg-gray-300"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* 标签计数和提示 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {language === "zh"
            ? `${tags.length}/${maxTags} 个标签`
            : `${tags.length}/${maxTags} tags`}
        </span>
        {tags.length >= maxTags && (
          <span className="text-orange-500">
            {language === "zh" ? "已达到最大标签数量" : "Maximum tags reached"}
          </span>
        )}
      </div>

      {/* 使用提示 */}
      <div className="text-xs text-gray-400">
        {language === "zh"
          ? "提示：按回车键或逗号添加标签，按退格键删除最后一个标签"
          : "Tip: Press Enter or comma to add tags, Backspace to remove last tag"}
      </div>
    </div>
  )
}
