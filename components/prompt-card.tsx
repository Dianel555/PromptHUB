'use client'

import { motion } from 'framer-motion'
import { Heart, Eye, User, Tag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ColorfulTag } from '@/components/colorful-tag'

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        rotateX: 5,
        rotateY: 5
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className="group cursor-pointer perspective-1000"
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
            {tags.slice(0, 3).map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ColorfulTag className="hover:scale-105 transition-transform duration-200">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </ColorfulTag>
              </motion.div>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="bg-accent/10 text-muted-foreground border-border">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* 作者信息 */}
            <div className="flex items-center space-x-2">
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
              <motion.div 
                className="flex items-center space-x-1 group-hover:text-red-400 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <Heart className="w-4 h-4" />
                <span>{likes}</span>
              </motion.div>
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