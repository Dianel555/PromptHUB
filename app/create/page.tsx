"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Save, 
  Eye, 
  EyeOff, 
  Star, 
  Upload,
  FileText,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmartTagInput, SmartTag } from "@/components/smart-tag-input"
import { toast } from "sonner"

export default function CreatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // 基本表单状态
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<SmartTag[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // 导入功能状态
  const [importText, setImportText] = useState("")
  const [showImport, setShowImport] = useState(false)

  // 处理导入JSON
  const handleImportJSON = () => {
    try {
      const data = JSON.parse(importText)
      
      if (data.title) setTitle(data.title)
      if (data.description) setDescription(data.description)
      if (data.content) setContent(data.content)
      if (data.tags && Array.isArray(data.tags)) {
        setTags(data.tags.map((tag: string) => ({ id: tag, name: tag })))
      }
      
      setShowImport(false)
      setImportText("")
      toast.success("JSON数据导入成功")
    } catch (error) {
      toast.error("JSON格式错误，请检查数据格式")
    }
  }

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text)
        
        if (data.title) setTitle(data.title)
        if (data.description) setDescription(data.description)
        if (data.content) setContent(data.content)
        if (data.tags && Array.isArray(data.tags)) {
          setTags(data.tags.map((tag: string) => ({ id: tag, name: tag })))
        }
        
        toast.success("文件导入成功")
      } catch (error) {
        toast.error("文件格式错误，请上传有效的JSON文件")
      }
    }
    reader.readAsText(file)
  }

  // 保存提示词
  const handleSave = async () => {
    if (!session) {
      toast.error("请先登录")
      return
    }

    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error("请填写完整的提示词信息")
      return
    }

    setIsSaving(true)
    
    try {
      const promptData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        tags: tags.map(tag => tag.name),
        author: {
          name: session.user?.name || "匿名用户",
          avatar: session.user?.image || undefined,
          id: session.user?.email || `user_${Date.now()}`
        },
        likes: 0,
        views: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        isLiked: false,
        isFavorited: false
      }

      // 动态导入统一数据管理器
      const { unifiedDataManager } = await import('@/lib/unified-data-manager')
      
      // 使用统一数据管理器创建提示词
      const savedPrompt = await unifiedDataManager.createPrompt(promptData)
      
      console.log('提示词创建成功:', savedPrompt)
      toast.success("提示词创建成功！")
      
      // 跳转到新创建的提示词详情页
      router.push(`/prompts/${savedPrompt.id}`)
    } catch (error) {
      console.error("保存失败:", error)
      toast.error("保存失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  // 如果未登录，显示登录提示
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>需要登录</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                请先登录以创建您的提示词
              </p>
              <Button onClick={() => router.push("/auth/signin")}>
                前往登录
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            创建新提示词
          </h1>
          <p className="text-muted-foreground">
            分享您的创意提示词，帮助更多人提升AI使用体验
          </p>
        </div>

        {/* 导入功能 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="size-5" />
              <span>导入数据</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImport(!showImport)}
                className="flex items-center space-x-2"
              >
                <FileText className="size-4" />
                <span>从JSON文本导入</span>
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="flex items-center space-x-2">
                  <Upload className="size-4" />
                  <span>从文件导入</span>
                </Button>
              </div>
            </div>

            {showImport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                <Textarea
                  placeholder="粘贴JSON数据..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleImportJSON} size="sm">
                    导入
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowImport(false)
                      setImportText("")
                    }}
                  >
                    取消
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* 主要表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="size-5" />
                <span>提示词信息</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center space-x-2"
                >
                  {isPreview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  <span>{isPreview ? "编辑" : "预览"}</span>
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  <span>{isSaving ? "保存中..." : "保存"}</span>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!isPreview ? (
              <>
                {/* 标题 */}
                <div className="space-y-2">
                  <Label htmlFor="title">标题 *</Label>
                  <Input
                    id="title"
                    placeholder="为您的提示词起一个吸引人的标题..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* 描述 */}
                <div className="space-y-2">
                  <Label htmlFor="description">描述 *</Label>
                  <Textarea
                    id="description"
                    placeholder="简要描述这个提示词的用途和特点..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* 内容 */}
                <div className="space-y-2">
                  <Label htmlFor="content">提示词内容 *</Label>
                  <Textarea
                    id="content"
                    placeholder="输入您的提示词内容..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] font-mono"
                  />
                </div>

                {/* 标签 */}
                <div className="space-y-2">
                  <Label>标签</Label>
                  <SmartTagInput
                    tags={tags}
                    onTagsChange={setTags}
                    placeholder="添加相关标签..."
                  />
                </div>
              </>
            ) : (
              /* 预览模式 */
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{title || "未设置标题"}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {description || "未设置描述"}
                  </p>
                </div>

                {content && (
                  <div className="rounded-lg bg-muted/50 p-4 border">
                    <h3 className="font-semibold mb-2">提示词内容：</h3>
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                      {content}
                    </pre>
                  </div>
                )}

                {tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">标签：</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}