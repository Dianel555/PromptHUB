"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { 
  Heart, 
  MessageCircle, 
  Copy, 
  Share2, 
  Edit, 
  Calendar,
  Eye,
  User,
  ArrowLeft,
  BookOpen,
  Tag
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// 模拟数据接口
interface PromptDetail {
  id: string
  title: string
  description: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    bio?: string
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

// 模拟数据
const mockPromptData: PromptDetail = {
  id: "1",
  title: "高效的代码审查提示词",
  description: "这是一个专门用于代码审查的AI提示词，能够帮助开发者快速识别代码中的问题并提供改进建议。",
  content: `# 代码审查助手

你是一位经验丰富的高级软件工程师，专门负责代码审查。请按照以下标准对提供的代码进行全面审查：

## 审查重点

### 1. 代码质量
- **可读性**: 代码是否清晰易懂，命名是否规范
- **可维护性**: 代码结构是否合理，是否易于修改和扩展
- **性能**: 是否存在性能瓶颈或优化空间

### 2. 最佳实践
- 是否遵循语言特定的编码规范
- 是否正确使用设计模式
- 错误处理是否完善

### 3. 安全性
- 是否存在安全漏洞
- 输入验证是否充分
- 敏感信息是否得到保护

## 输出格式

请按照以下格式提供审查结果：

\`\`\`
## 总体评价
[整体代码质量评分：1-10分]

## 主要问题
1. [问题描述]
   - 位置：[文件名:行号]
   - 严重程度：[高/中/低]
   - 建议：[具体改进建议]

## 优点
- [代码中做得好的地方]

## 改进建议
- [具体的改进建议和最佳实践]
\`\`\`

请确保审查意见具体、可操作，并提供代码示例说明改进方案。`,
  author: {
    id: "author1",
    name: "张开发",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "全栈开发工程师，专注于代码质量和团队协作"
  },
  tags: ["代码审查", "软件工程", "最佳实践", "质量保证"],
  likes: 128,
  comments: 23,
  views: 1547,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:20:00Z",
  isLiked: false,
  isOwner: false
}

export default function PromptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<PromptDetail | null>(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟API调用
    const fetchPrompt = async () => {
      setLoading(true)
      try {
        // 这里应该是真实的API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        setPrompt(mockPromptData)
        setLiked(mockPromptData.isLiked)
        setLikeCount(mockPromptData.likes)
      } catch (error) {
        console.error("获取提示词详情失败:", error)
        toast.error("加载失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    fetchPrompt()
  }, [params.id])

  const handleCopy = async () => {
    if (!prompt) return
    
    try {
      await navigator.clipboard.writeText(prompt.content)
      toast.success("提示词已复制到剪贴板")
    } catch (error) {
      console.error("复制失败:", error)
      toast.error("复制失败，请手动复制")
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
    
    // TODO: 调用API更新点赞状态
    toast.success(liked ? "已取消点赞" : "点赞成功")
  }

  const handleShare = async () => {
    if (!prompt) return
    
    try {
      await navigator.share({
        title: prompt.title,
        text: prompt.description,
        url: window.location.href
      })
    } catch (error) {
      // 如果不支持原生分享，则复制链接
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("链接已复制到剪贴板")
      } catch (clipboardError) {
        toast.error("分享失败")
      }
    }
  }

  const handleEdit = () => {
    router.push(`/prompts/${params.id}/edit`)
  }

  const handleAuthorClick = () => {
    if (prompt?.author.id) {
      router.push(`/profile/${prompt.author.id}`)
    }
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
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
    ]
    const hash = tagName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">提示词不存在</h1>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="size-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="size-4 mr-2" />
              返回
            </Button>
          </motion.div>

          {/* 主要内容 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：提示词内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 标题和描述 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                          {prompt.title}
                        </h1>
                        <p className="text-muted-foreground leading-relaxed">
                          {prompt.description}
                        </p>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="hover:bg-primary/10"
                        >
                          <Copy className="size-4 mr-2" />
                          复制
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="hover:bg-primary/10"
                        >
                          <Share2 className="size-4 mr-2" />
                          分享
                        </Button>
                        
                        {prompt.isOwner && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="hover:bg-green-500/10 text-green-600 border-green-200 dark:text-green-400 dark:border-green-800"
                          >
                            <Edit className="size-4 mr-2" />
                            编辑
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {prompt.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className={`text-sm border-0 hover:scale-105 transition-all cursor-pointer ${getTagColor(tag)}`}
                        >
                          <Tag className="size-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* 提示词内容 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="size-5 text-primary" />
                      <h2 className="text-xl font-semibold">提示词内容</h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-semibold text-foreground mb-3 mt-6">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className
                            return isInline ? (
                              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-muted p-4 rounded-lg text-sm font-mono text-foreground overflow-x-auto">
                                {children}
                              </code>
                            )
                          },
                          pre: ({ children }) => (
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                              {children}
                            </blockquote>
                          )
                        }}
                      >
                        {prompt.content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* 右侧：作者信息和统计 */}
            <div className="space-y-6">
              {/* 作者信息 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="size-5 mr-2 text-primary" />
                      作者信息
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="flex items-start space-x-3 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                      onClick={handleAuthorClick}
                    >
                      <Avatar className="size-12">
                        <AvatarImage src={prompt.author.avatar} alt={prompt.author.name} />
                        <AvatarFallback className="text-lg">
                          {prompt.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                          {prompt.author.name}
                        </h4>
                        {prompt.author.bio && (
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {prompt.author.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 统计信息 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* 点赞按钮 */}
                      <Button
                        variant={liked ? "default" : "outline"}
                        onClick={handleLike}
                        className={`w-full ${
                          liked 
                            ? "bg-red-500 hover:bg-red-600 text-white" 
                            : "hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950"
                        }`}
                      >
                        <Heart className={`size-4 mr-2 ${liked ? "fill-current" : ""}`} />
                        {liked ? "已点赞" : "点赞"} ({likeCount})
                      </Button>

                      <Separator />

                      {/* 统计数据 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <Eye className="size-4 mr-2" />
                            浏览量
                          </span>
                          <span className="font-medium">{prompt.views.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <MessageCircle className="size-4 mr-2" />
                            评论数
                          </span>
                          <span className="font-medium">{prompt.comments}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <Calendar className="size-4 mr-2" />
                            创建时间
                          </span>
                          <span className="font-medium text-xs">
                            {formatDate(prompt.createdAt)}
                          </span>
                        </div>
                        
                        {prompt.updatedAt !== prompt.createdAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">最后更新</span>
                            <span className="font-medium text-xs">
                              {formatDate(prompt.updatedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}