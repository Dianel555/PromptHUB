'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  getTagTheme, 
  getDimensionColor, 
  generateTagStyles, 
  generateTagClasses,
  TagThemeConfig 
} from '@/lib/enhanced-tag-themes'

interface ThemeAdaptiveTagProps {
  children: React.ReactNode
  dimension?: string
  confidence?: number
  theme?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'solid' | 'outline' | 'ghost' | 'gradient'
  customColor?: string
  customTextColor?: string
  removable?: boolean
  interactive?: boolean
  animated?: boolean
  glowing?: boolean
  pulsing?: boolean
  shimmer?: boolean
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

export function ThemeAdaptiveTag({
  children,
  dimension = 'custom',
  confidence = 1.0,
  theme = 'default',
  size = 'md',
  variant = 'solid',
  customColor,
  customTextColor,
  removable = false,
  interactive = true,
  animated = true,
  glowing = false,
  pulsing = false,
  shimmer = false,
  onRemove,
  onClick,
  className = ''
}: ThemeAdaptiveTagProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const themeConfig = getTagTheme(theme)
  
  // 动画变体
  const tagVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      y: 10
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0
    },
    hover: {
      scale: interactive ? themeConfig.effects.hover.scale : 1,
      filter: `brightness(${themeConfig.effects.hover.brightness})`
    },
    tap: {
      scale: interactive ? 0.95 : 1
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: -10
    }
  }

  // 脉动动画
  const pulseVariants = {
    pulse: {
      boxShadow: [
        `0 0 0 0 ${getDimensionColor(dimension, themeConfig)}40`,
        `0 0 0 10px ${getDimensionColor(dimension, themeConfig)}00`,
      ]
    }
  }

  // 闪烁动画
  const shimmerVariants = {
    shimmer: {
      backgroundPosition: ['200% 0', '-200% 0']
    }
  }

  // 生成标签样式
  const tagStyles = generateTagStyles(dimension, themeConfig, variant, customColor)
  const tagClasses = generateTagClasses(dimension, themeConfig, size, variant)

  // 置信度指示器
  const ConfidenceIndicator = () => {
    if (confidence < 0.3) return null
    
    const getConfidenceIcon = () => {
      if (confidence >= 0.8) return <Star className="w-3 h-3" />
      if (confidence >= 0.6) return <Zap className="w-3 h-3" />
      return <Star className="w-3 h-3" />
    }

    const getConfidenceColor = () => {
      if (confidence >= 0.8) return '#10B981'
      if (confidence >= 0.6) return '#F59E0B'
      return '#6B7280'
    }

    return (
      <span 
        className="ml-1 opacity-70"
        style={{ color: getConfidenceColor() }}
        title={`置信度: ${(confidence * 100).toFixed(0)}%`}
      >
        {getConfidenceIcon()}
      </span>
    )
  }

  // 移除按钮
  const RemoveButton = () => (
    <motion.button
      className="ml-2 p-0.5 rounded-full hover:bg-black/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation()
        onRemove?.()
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <X className="w-3 h-3" />
    </motion.button>
  )

  return (
    <AnimatePresence>
      <motion.div
        className={cn(tagClasses, className)}
        style={{
          ...tagStyles,
          ...(customTextColor && { color: customTextColor }),
          ...(glowing && { 
            boxShadow: themeConfig.effects.glow,
            filter: 'drop-shadow(0 0 8px currentColor)'
          }),
          ...(shimmer && {
            background: `linear-gradient(90deg, ${tagStyles.backgroundColor} 25%, rgba(255,255,255,0.3) 50%, ${tagStyles.backgroundColor} 75%)`,
            backgroundSize: '200% 100%'
          })
        }}
        variants={tagVariants}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={interactive ? "hover" : undefined}
        whileTap={interactive ? "tap" : undefined}
        exit={animated ? "exit" : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onClick={onClick}
      >
        <span className="flex items-center">
          {children}
          <ConfidenceIndicator />
          {removable && <RemoveButton />}
        </span>

        {/* 悬停效果 */}
        {isHovered && interactive && (
          <motion.div
            className="absolute inset-0 rounded-inherit"
            style={{
              background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
              pointerEvents: 'none'
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// 标签列表组件
interface ThemeAdaptiveTagListProps {
  tags: Array<{
    id: string
    name: string
    dimension?: string
    confidence?: number
  }>
  theme?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'solid' | 'outline' | 'ghost' | 'gradient'
  removable?: boolean
  animated?: boolean
  maxTags?: number
  onTagRemove?: (tagId: string) => void
  onTagClick?: (tagId: string) => void
  className?: string
}

export function ThemeAdaptiveTagList({
  tags,
  theme = 'default',
  size = 'md',
  variant = 'solid',
  removable = false,
  animated = true,
  maxTags,
  onTagRemove,
  onTagClick,
  className = ''
}: ThemeAdaptiveTagListProps) {
  const [showAll, setShowAll] = useState(false)
  const displayTags = maxTags && !showAll ? tags.slice(0, maxTags) : tags
  const hasMoreTags = maxTags && tags.length > maxTags

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <AnimatePresence>
        {displayTags.map((tag, index) => (
          <motion.div
            key={tag.id}
            initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: animated ? index * 0.05 : 0 }}
          >
            <ThemeAdaptiveTag
              dimension={tag.dimension}
              confidence={tag.confidence}
              theme={theme}
              size={size}
              variant={variant}
              removable={removable}
              animated={animated}
              onRemove={() => onTagRemove?.(tag.id)}
              onClick={() => onTagClick?.(tag.id)}
            >
              {tag.name}
            </ThemeAdaptiveTag>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 显示更多按钮 */}
      {hasMoreTags && (
        <motion.button
          className="px-3 py-1 text-sm text-gray-500 border border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowAll(!showAll)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showAll ? '收起' : `+${tags.length - maxTags} 更多`}
        </motion.button>
      )}
    </div>
  )
}

// 标签云组件
interface TagCloudProps {
  tags: Array<{
    id: string
    name: string
    count: number
    dimension?: string
  }>
  theme?: string
  maxSize?: number
  minSize?: number
  onTagClick?: (tagId: string) => void
  className?: string
}

export function TagCloud({
  tags,
  theme = 'default',
  maxSize = 24,
  minSize = 12,
  onTagClick,
  className = ''
}: TagCloudProps) {
  const maxCount = Math.max(...tags.map(tag => tag.count))
  const minCount = Math.min(...tags.map(tag => tag.count))

  const getFontSize = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount)
    return minSize + (maxSize - minSize) * ratio
  }

  const getOpacity = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount)
    return 0.6 + 0.4 * ratio
  }

  return (
    <div className={cn("flex flex-wrap gap-3 justify-center items-center", className)}>
      {tags.map((tag) => (
        <motion.div
          key={tag.id}
          style={{
            fontSize: `${getFontSize(tag.count)}px`,
            opacity: getOpacity(tag.count)
          }}
          whileHover={{ 
            scale: 1.1,
            opacity: 1,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ThemeAdaptiveTag
            dimension={tag.dimension}
            theme={theme}
            variant="ghost"
            interactive={true}
            animated={true}
            onClick={() => onTagClick?.(tag.id)}
            className="cursor-pointer"
          >
            {tag.name}
            <span className="ml-1 text-xs opacity-70">({tag.count})</span>
          </ThemeAdaptiveTag>
        </motion.div>
      ))}
    </div>
  )
}

// 标签输入组件
interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  theme?: string
  placeholder?: string
  maxTags?: number
  className?: string
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  theme = 'default',
  placeholder = '输入标签...',
  maxTags,
  className = ''
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  )

  const addTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag.trim()) && (!maxTags || value.length < maxTags)) {
      onChange([...value, tag.trim()])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <ThemeAdaptiveTagList
          tags={value.map(tag => ({ id: tag, name: tag }))}
          theme={theme}
          size="sm"
          removable={true}
          animated={true}
          onTagRemove={removeTag}
        />
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag(inputValue)
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          disabled={!!(maxTags && value.length >= maxTags)}
        />
      </div>

      {/* 建议列表 */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}