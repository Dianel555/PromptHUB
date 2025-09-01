"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  X, 
  ArrowLeft,
  FileText,
  Tag,
  BookOpen,
  Trash2,
  AlertTriangle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getPromptById, updatePrompt, deletePrompt } from "@/lib/prompt-storage"

interface EditPromptForm {
  title: string
  description: string
  content: string
  tags: string[]
  isPublic: boolean
}

// 模拟获取提示词数据
const mockPromptData = {
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
  tags: ["代码审查", "软件工程", "最佳实践", "质量保证"],
  isPublic: true
}

export default function EditPromptPage() {
  const params = useParams()
  const router = useRouter()
  const [form, setForm] = useState<EditPromptForm>({
    title: "",
    description: "",
    content: "",
    tags: [],
    isPublic: true
  })
  const [newTag, setNewTag] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 加载提示词数据
    const loadPrompt = async () => {
      setLoading(true)
      try {
        const prompt = getPromptById(params.id as string)
        if (prompt) {
          setForm({
            title: prompt.title,
            description: prompt.description,
            content: prompt.content,
            tags: prompt.tags,
            isPublic: prompt.isPublic
          })
        } else {
          toast.error("提示词不存在")
          router.push("/prompts")
        }
      } catch (error) {
        console.error("加载提示词失败:", error)
        toast.error("加载失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    loadPrompt()
  }, [params.id, router])

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

  const handleInputChange = (field: keyof EditPromptForm, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !form.tags.includes(trimmedTag) && form.tags.length < 10) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
      setNewTag("")
    } else if (form.tags.length >= 10) {
      toast.error("最多只能添加10个标签")
    } else if (form.tags.includes(trimmedTag)) {
      toast.error("标签已存在")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSave = async () => {
    // 表单验证
    if (!form.title.trim()) {
      toast.error("请输入提示词标题")
      return
    }
    if (!form.description.trim()) {
      toast.error("请输入提示词描述")
      return
    }
    if (!form.content.trim()) {
      toast.error("请输入提示词内容")
      return
    }
    if (form.tags.length === 0) {
      toast.error("请至少添加一个标签")
      return
    }

    setSaving(true)
    try {
      const updatedPrompt = updatePrompt(params.id as string, {
        title: form.title.trim(),
        description: form.description.trim(),
        content: form.content.trim(),
        tags: form.tags,
        isPublic: form.isPublic
      })
      
      if (updatedPrompt) {
        toast.success("提示词更新成功！")
        router.push("/prompts")
      } else {
        toast.error("提示词不存在")
      }
    } catch (error) {
      console.error("保存失败:", error)
      toast.error("保存失败，请重试")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const success = deletePrompt(params.id as string)
      
      if (success) {
        toast.success("提示词已删除")
        router.push("/prompts")
      } else {
        toast.error("提示词不存在")
      }
    } catch (error) {
      console.error("删除失败:", error)
      toast.error("删除失败，请重试")
    } finally {
      setDeleting(false)
    }
  }

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 头部 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.back()}
                  className="hover:bg-muted/50"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  返回
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground flex items-center">
                    <FileText className="size-8 mr-3 text-primary" />
                    编辑提示词
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    修改和完善你的AI提示词
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handlePreviewToggle}
                  className="hover:bg-muted/50"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="size-4 mr-2" />
                      隐藏预览
                    </>
                  ) : (
                    <>
                      <Eye className="size-4 mr-2" />
                      显示预览
                    </>
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950"
                    >
                      <Trash2 className="size-4 mr-2" />
                      删除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center">
                        <AlertTriangle className="size-5 mr-2 text-red-500" />
                        确认删除
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        此操作无法撤销。这将永久删除你的提示词。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {deleting ? "删除中..." : "确认删除"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      保存更改
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* 主要内容 */}
          <div className={`grid gap-8 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* 左侧：编辑表单 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* 基本信息 */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileText className="size-5 mr-2 text-primary" />
                    基本信息
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 标题 */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      标题 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="为你的提示词起一个吸引人的标题..."
                      value={form.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50"
                      maxLength={100}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {form.title.length}/100
                    </div>
                  </div>

                  {/* 描述 */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      描述 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="简要描述这个提示词的用途和特点..."
                      value={form.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {form.description.length}/500
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 标签管理 */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Tag className="size-5 mr-2 text-primary" />
                    标签管理
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 添加标签 */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="输入标签名称..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-background/50 border-border/50 focus:border-primary/50"
                      maxLength={20}
                    />
                    <Button
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || form.tags.length >= 10}
                      variant="outline"
                      className="shrink-0 hover:bg-primary/10"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  {/* 标签列表 */}
                  {form.tags.length > 0 && (
                    <div className="space-y-3">
                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        {form.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className={`text-sm border-0 hover:scale-105 transition-all cursor-pointer ${getTagColor(tag)}`}
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        已添加 {form.tags.length}/10 个标签
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 提示词内容 */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BookOpen className="size-5 mr-2 text-primary" />
                    提示词内容
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                      内容 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      value={form.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[400px] font-mono text-sm leading-relaxed resize-none"
                      maxLength={10000}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {form.content.length}/10,000
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 右侧：实时预览 */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm sticky top-8">
                  <CardHeader className="pb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Eye className="size-5 mr-2 text-primary" />
                      实时预览
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 预览标题和描述 */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground leading-tight">
                          {form.title || "提示词标题"}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {form.description || "提示词描述"}
                      </p>
                    </div>

                    {/* 预览标签 */}
                    {form.tags.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {form.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              className={`text-sm border-0 ${getTagColor(tag)}`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* 预览内容 */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">内容预览</h4>
                      <div className="max-h-[500px] overflow-y-auto">
                        {form.content ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="text-xl font-bold text-foreground mb-3 pb-2 border-b border-border">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-lg font-semibold text-foreground mb-2 mt-4">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-base font-medium text-foreground mb-2 mt-3">
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p className="text-muted-foreground leading-relaxed mb-3">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside space-y-1 mb-3 text-muted-foreground">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-inside space-y-1 mb-3 text-muted-foreground">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="leading-relaxed">{children}</li>
                                ),
                                code: ({ children, className }) => {
                                  const isInline = !className
                                  return isInline ? (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
                                      {children}
                                    </code>
                                  ) : (
                                    <code className="block bg-muted p-3 rounded-lg text-xs font-mono text-foreground overflow-x-auto">
                                      {children}
                                    </code>
                                  )
                                },
                                pre: ({ children }) => (
                                  <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-3">
                                    {children}
                                  </pre>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-primary pl-3 italic text-muted-foreground mb-3">
                                    {children}
                                  </blockquote>
                                )
                              }}
                            >
                              {form.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <BookOpen className="size-12 mx-auto mb-3 opacity-50" />
                            <p>开始输入内容以查看预览</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}