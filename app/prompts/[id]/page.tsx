"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  MessageCircle,
  Copy,
  Share2,
  Edit,
  Tag,
  Calendar,
  Eye,
  User,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"

interface PromptDetail {
  id: string
  title: string
  description: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    bio: string
  }
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: string
  updatedAt: string
  isLiked: boolean
  isOwner: boolean
}

// 获取真实数据的函数
const getPromptData = async (id: string): Promise<PromptDetail | null> => {
  try {
    // 首先尝试从本地存储获取数据
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]')
    const prompt = prompts.find((p: any) => p.id === id)
    
    if (prompt) {
      // 获取当前用户信息来判断是否为创建者
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      
      return {
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        author: {
          id: prompt.author?.id || 'unknown',
          name: prompt.author?.name || '匿名用户',
          avatar: prompt.author?.avatar,
          bio: prompt.author?.bio || '这个用户很神秘，什么都没有留下。'
        },
        tags: prompt.tags || [],
        likes: prompt.likes || 0,
        comments: prompt.comments || 0,
        views: prompt.views || 0,
        createdAt: prompt.createdAt || new Date().toISOString(),
        updatedAt: prompt.updatedAt || prompt.createdAt || new Date().toISOString(),
        isLiked: prompt.isLiked || false,
        isOwner: currentUser.id === prompt.author?.id
      }
    }
    
    return null
  } catch (error) {
    console.error('获取提示词数据失败:', error)
    return null
  }
}

// 模拟数据作为后备
const mockPromptData: PromptDetail = {
  id: "1",
  title: "高效的代码审查提示词",
  description: "这是一个专门用于代码审查的AI提示词，能够帮助开发者快速识别代码中的问题并提供改进建议。",
  content: `你是一位经验丰富的高级软件工程师，专门负责代码审查。请仔细审查以下代码，并从以下几个方面提供详细的反馈：

1. **代码质量**：
   - 代码是否遵循最佳实践？
   - 是否有潜在的性能问题？
   - 代码的可读性如何？

2. **安全性**：
   - 是否存在安全漏洞？
   - 输入验证是否充分？
   - 是否有敏感信息泄露的风险？

3. **架构设计**：
   - 代码结构是否合理？
   - 是否符合SOLID原则？
   - 模块化程度如何？

4. **测试覆盖**：
   - 是否需要添加单元测试？
   - 边界条件是否考虑充分？

请提供具体的改进建议，并给出修改后的代码示例。`,
  author: {
    id: "user1",
    name: "张开发",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang",
    bio: "全栈开发工程师，专注于Web技术和AI应用开发"
  },
  tags: ["代码审查", "软件工程", "最佳实践", "质量保证"],
  likes: 128,
  comments: 23,
  views: 1205,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-16T14:20:00Z",
  isLiked: false,
  isOwner: false
}

export default function PromptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<PromptDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    // 获取真实提示词数据
    const fetchPrompt = async () => {
      setLoading(true)
      try {
        const promptData = await getPromptData(params.id as string)
        
        if (promptData) {
          setPrompt(promptData)
          setLiked(promptData.isLiked)
          setLikeCount(promptData.likes)
          
          // 增加浏览量
          const prompts = JSON.parse(localStorage.getItem('prompts') || '[]')
          const updatedPrompts = prompts.map((p: any) => 
            p.id === params.id ? { ...p, views: (p.views || 0) + 1 } : p
          )
          localStorage.setItem('prompts', JSON.stringify(updatedPrompts))
        } else {
          // 如果找不到真实数据，使用模拟数据
          setPrompt(mockPromptData)
          setLiked(mockPromptData.isLiked)
          setLikeCount(mockPromptData.likes)
        }
      } catch (error) {
        console.error("获取提示词详情失败:", error)
        toast.error("加载失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    fetchPrompt()
  }, [params.id])

  const handleLike = () => {
    const newLikedState = !liked
    const newLikeCount = liked ? likeCount - 1 : likeCount + 1
    
    setLiked(newLikedState)
    setLikeCount(newLikeCount)
    
    // 更新本地存储中的点赞状态
    try {
      const prompts = JSON.parse(localStorage.getItem('prompts') || '[]')
      const updatedPrompts = prompts.map((p: any) => 
        p.id === params.id 
          ? { 
              ...p, 
              likes: newLikeCount,
              isLiked: newLikedState 
            } 
          : p
      )
      localStorage.setItem('prompts', JSON.stringify(updatedPrompts))
      
      // 更新当前prompt状态
      if (prompt) {
        setPrompt({
          ...prompt,
          likes: newLikeCount,
          isLiked: newLikedState
        })
      }
      
      toast.success(newLikedState ? "点赞成功" : "已取消点赞")
    } catch (error) {
      console.error("更新点赞状态失败:", error)
      // 回滚状态
      setLiked(liked)
      setLikeCount(likeCount)
      toast.error("操作失败，请重试")
    }
  }

  const handleCopy = async () => {
    if (!prompt?.content) {
      toast.error("没有可复制的内容")
      return
    }

    try {
      await navigator.clipboard.writeText(prompt.content)
      toast.success("提示词内容已复制到剪贴板")
    } catch (error) {
      console.error("复制失败:", error)
      toast.error("复制失败，请手动复制")
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/prompts/${params.id}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success("分享链接已复制到剪贴板")
    } catch (error) {
      console.error("分享失败:", error)
      toast.error("分享失败")
    }
  }

  const handleEdit = () => {
    router.push(`/prompts/${params.id}/edit`)
  }

  const handleBack = () => {
    router.back()
  }

  const handleAuthorClick = () => {
    router.push('/profile')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 智能标签颜色分配
  const getTagColor = (tagName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 dark:hover:text-blue-200",
      "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 dark:hover:text-green-200",
      "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50 dark:hover:text-purple-200",
      "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-800/50 dark:hover:text-orange-200",
      "bg-pink-100 text-pink-800 hover:bg-pink-200 hover:text-pink-900 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-800/50 dark:hover:text-pink-200",
      "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50 dark:hover:text-indigo-200"
    ]
    const hash = tagName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">提示词不存在</h1>
              <p className="text-muted-foreground mb-6">抱歉，您访问的提示词不存在或已被删除。</p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="size-4 mr-2" />
                返回
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="size-4 mr-2" />
            返回
          </Button>
        </motion.div>

        {/* 主要内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              {/* 头部信息 */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-tight">
                      {prompt.title}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 lg:ml-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="hover:bg-primary/10 transition-all duration-200"
                    >
                      <Copy className="size-4 lg:mr-2" />
                      <span className="hidden lg:inline">复制</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="hover:bg-primary/10 transition-all duration-200"
                    >
                      <Share2 className="size-4 lg:mr-2" />
                      <span className="hidden lg:inline">分享</span>
                    </Button>
                    
                    {prompt.isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="hover:bg-primary/10 text-primary border-primary/20 hover:border-primary/40 transition-all duration-200"
                      >
                        <Edit className="size-4 lg:mr-2" />
                        <span className="hidden lg:inline">编辑</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* 标签 */}
                {prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {prompt.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className={`text-sm border-0 hover:scale-105 transition-all duration-200 cursor-pointer ${getTagColor(tag)}`}
                      >
                        <Tag className="size-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-8" />

              {/* 作者信息 */}
              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <Avatar 
                    className="size-12 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    onClick={handleAuthorClick}
                  >
                    <AvatarImage 
                      src={prompt.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(prompt.author.name)}`}
                      alt={prompt.author.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="size-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <button 
                      className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer transition-colors"
                      onClick={handleAuthorClick}
                    >
                      {prompt.author.name}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">
                      {prompt.author.bio}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* 提示词内容 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">提示词内容</h2>
                <div className="rounded-lg bg-muted/30 p-6 border border-border/50">
                  <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-mono">
                    {prompt.content}
                  </pre>
                </div>
              </div>

              <Separator className="my-8" />

              {/* 统计信息和互动 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="size-4" />
                    <span>创建于 {formatDate(prompt.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Eye className="size-4" />
                    <span>{prompt.views} 次浏览</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="size-4" />
                    <span>{prompt.comments} 条评论</span>
                  </div>
                </div>

                {/* 点赞按钮 */}
                <motion.button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    liked 
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" 
                      : "bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  }`}
                  onClick={handleLike}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`size-5 ${liked ? "fill-current" : ""}`} />
                  <span className="font-medium">{likeCount}</span>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}