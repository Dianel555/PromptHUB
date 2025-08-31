"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  User,
  Star,
  BookOpen
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface CreatePromptForm {
  title: string
  description: string
  content: string
  tags: string[]
  isPublic: boolean
}

export default function CreatePromptPage() {
  const router = useRouter()
  const [form, setForm] = useState<CreatePromptForm>({
    title: "",
    description: "",
    content: "",
    tags: [],
    isPublic: true
  })
  const [newTag, setNewTag] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

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

  const handleInputChange = (field: keyof CreatePromptForm, value: string | boolean) => {
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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // TODO: 实际的API调用
      console.log("保存提示词:", form)
      
      toast.success("提示词创建成功！")
      router.push("/prompts")
    } catch (error) {
      console.error("保存失败:", error)
      toast.error("保存失败，请重试")
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview)
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
                    <Star className="size-8 mr-3 text-primary" />
                    创建提示词
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    创建一个高质量的AI提示词，与社区分享你的创意
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
                      保存提示词
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
                  <p className="text-sm text-muted-foreground">
                    添加相关标签，帮助其他用户更容易找到你的提示词
                  </p>
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
                  <p className="text-sm text-muted-foreground">
                    支持 Markdown 格式，可以使用标题、列表、代码块等格式
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                      内容 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="在这里输入你的提示词内容...

示例：
# 角色设定
你是一个专业的...

## 任务要求
1. 分析用户输入
2. 提供详细建议
3. 给出具体示例

## 输出格式
请按照以下格式输出：
- 分析结果：...
- 建议方案：...
- 示例代码：...
"
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