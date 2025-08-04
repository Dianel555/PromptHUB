'use client'

import { motion } from 'framer-motion'
import { Heart, Eye, User, Tag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ColorfulTag } from '@/components/colorful-tag'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { getTagColorScheme } from '@/lib/tag-colors'
import { useTheme } from 'next-themes'

interface PromptCardProps {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  likes: number
  views: number
  featured?: boolean
}

export function PromptCard({
  id,
  title,
  description,
  author,
  tags,
  likes,
  views,
  featured = false
}: PromptCardProps) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const { data: session, status } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  
  // 检测当前是否为深色模式
  const isDark = resolvedTheme === 'dark'

  const handleCardClick = () => {
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/prompts/${id}`))
      return
    }
    // 跳转到提示词详情页面
    router.push(`/prompts/${id}`)
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname))
      return
    }
    
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    
    // TODO: 调用API更新点赞状态
    console.log(`${isLiked ? '取消点赞' : '点赞'} 提示词:`, id)
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/users/${author.name}`))
      return
    }
    
    // 跳转到作者页面
    router.push(`/users/${author.name}`)
  }
  const isAuthenticated = status === 'authenticated'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isAuthenticated ? { 
        y: -8,
        scale: 1.02,
        rotateX: 5,
        rotateY: 5
      } : {
        scale: 1.01
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className={`group cursor-pointer perspective-1000 ${
        !isAuthenticated ? 'opacity-75 hover:opacity-90' : ''
      }`}
      onClick={handleCardClick}
    >
      <Card className={`
        relative overflow-hidden border-0 bg-gradient-to-br from-white/10 to-white/5 
        backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300
        ${featured ? 'ring-2 ring-purple-500/50 shadow-purple-500/20' : ''}
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 before:to-cyan-500/10 before:opacity-0 
        hover:before:opacity-100 before:transition-opacity before:duration-300
      `}>
        {/* 发光边框效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        
        {/* 内容区域 */}
        <div className="relative p-6 space-y-4">
          {/* 标题和特色标识 */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            {featured && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex-shrink-0 ml-2"
              >
                <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0">
                  精选
                </Badge>
              </motion.div>
            )}
          </div>

          {/* 描述 */}
          <p className="text-muted-foreground text-sm line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
            {description}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => {
              const colorScheme = getTagColorScheme(tag, isDark)
              return (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Badge 
                    className={`
                      ${colorScheme.background} ${colorScheme.text} ${colorScheme.border}
                      hover:scale-105 transition-all duration-200 cursor-pointer
                      hover:shadow-lg ${colorScheme.hover}
                    `}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (status === 'unauthenticated') {
                        router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname))
                        return
                      }
                      // 跳转到标签页面
                      router.push(`/tags/${tag}`)
                    }}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                </motion.div>
              )
            })}
            {tags.length > 3 && (
              <Badge variant="secondary" className="bg-accent/10 text-muted-foreground border-border">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* 作者信息 */}
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAuthorClick}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xs">
                  {author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                {author.name}
              </span>
            </div>

            {/* 统计信息 */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <motion.button 
                className={`flex items-center space-x-1 transition-colors duration-300 ${
                  isLiked ? 'text-red-500' : 'hover:text-red-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLikeClick}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </motion.button>
              <motion.div 
                className="flex items-center space-x-1 group-hover:text-blue-400 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <Eye className="w-4 h-4" />
                <span>{views}</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 点击涟漪效果 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-lg opacity-0"
          whileTap={{ 
            opacity: [0, 0.3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  )
}