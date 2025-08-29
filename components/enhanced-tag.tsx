"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  getTagThemeClasses, 
  getTagAccessibilityProps, 
  type TagType 
} from '@/lib/enhanced-tag-system'

interface EnhancedTagProps {
  children: React.ReactNode
  type?: TagType
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  animated?: boolean
  className?: string
  onClick?: () => void
  onRemove?: () => void
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
}

export function EnhancedTag({
  children,
  type = 'default',
  variant = 'solid',
  size = 'sm',
  removable = false,
  animated = true,
  className,
  onClick,
  onRemove
}: EnhancedTagProps) {
  const themeClasses = getTagThemeClasses(type, variant)
  const accessibilityProps = getTagAccessibilityProps(type)
  
  const tagClasses = cn(
    'inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current/50',
    'cursor-pointer select-none',
    themeClasses,
    sizeClasses[size],
    className
  )

  const tagContent = (
    <>
      <span className="truncate">{children}</span>
      
      {removable && (
        <button
          type="button"
          className="ml-1 inline-flex size-4 items-center justify-center rounded-full hover:bg-current/20 focus:bg-current/20 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          aria-label="移除标签"
        >
          <X className="size-3" />
        </button>
      )}
    </>
  )

  if (animated) {
    return (
      <motion.span
        className={tagClasses}
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        {...accessibilityProps}
      >
        {tagContent}
      </motion.span>
    )
  }

  return (
    <span
      className={tagClasses}
      onClick={onClick}
      {...accessibilityProps}
    >
      {tagContent}
    </span>
  )
}

// 标签列表组件
interface EnhancedTagListProps {
  tags: Array<{
    id: string
    name: string
    type?: TagType
  }>
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  animated?: boolean
  maxTags?: number
  className?: string
  onTagClick?: (tagId: string) => void
  onTagRemove?: (tagId: string) => void
}

export function EnhancedTagList({
  tags,
  variant = 'solid',
  size = 'sm',
  removable = false,
  animated = true,
  maxTags,
  className,
  onTagClick,
  onTagRemove
}: EnhancedTagListProps) {
  const [showAll, setShowAll] = React.useState(false)
  
  const displayTags = maxTags && !showAll ? tags.slice(0, maxTags) : tags
  const hasMoreTags = maxTags && tags.length > maxTags

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayTags.map((tag) => (
        <EnhancedTag
          key={tag.id}
          type={tag.type}
          variant={variant}
          size={size}
          removable={removable}
          animated={animated}
          onClick={() => onTagClick?.(tag.id)}
          onRemove={() => onTagRemove?.(tag.id)}
        >
          {tag.name}
        </EnhancedTag>
      ))}
      
      {hasMoreTags && (
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-dashed border-current/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-current/50 hover:text-foreground"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? '收起' : `+${tags.length - maxTags} 更多`}
        </button>
      )}
    </div>
  )
}