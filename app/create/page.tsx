"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Save,
  Eye,
  EyeOff,
  Upload,
  FileText,
  BookOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmartTagInput, SmartTag } from "@/components/smart-tag-input"
import { toast } from "sonner"
import { savePrompt, getCurrentUserInfo } from "@/lib/prompt-storage"

export default function CreatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 表单状态
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<SmartTag[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 导入状态
  const [importText, setImportText] = useState("")
  const [showImport, setShowImport] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 处理导入JSON文本
  const handleImportJSON = () => {
    try {
      const data = JSON.parse(importText)
      if (data.title) setTitle(data.title)
      if (data.description) setDescription(data.description)
      if (data.content) setContent(data.content)
      if (Array.isArray(data.tags)) {
        setTags(data.tags.map((t: string) => ({ id: t, name: t })))
      }
      setShowImport(false)
      setImportText("")
      toast.success("JSON数据导入成功")
    } catch {
      toast.error("JSON格式错误，请检查数据")
    }
  }

  // 文件选择按钮
  const handlePickFile = () => {
    fileInputRef.current?.click()
  }

  // 处理文件上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result || "")
        const data = JSON.parse(text)
        if (data.title) setTitle(data.title)
        if (data.description) setDescription(data.description)
        if (data.content) setContent(data.content)
        if (Array.isArray(data.tags)) {
          setTags(data.tags.map((t: string) => ({ id: t, name: t })))
        }
        toast.success("文件导入成功")
      } catch {
        toast.error("文件格式错误，请上传有效的JSON文件")
      } finally {
        // 允许选择同一文件时再次触发 onChange
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    reader.readAsText(file)
  }

  // 保存
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
      // 固定使用本地用户信息，确保与 /prompts 过滤一致
      const currentUser = getCurrentUserInfo()

      const payload = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        tags: tags.map((t) => t.name),
        author: {
          id: currentUser.id, // 对齐 getCurrentUserId() => "current_user"
          name: currentUser.name || (session.user?.name ?? "匿名用户"),
          avatar: currentUser.avatar || (session.user?.image ?? undefined),
        },
        isPublic: true,
        isLiked: false,
        isFavorited: false,
      }

      const created = savePrompt(payload as any)
      toast.success("提示词创建成功！")
      router.push(`/prompts/${created.id}`)
    } catch (error) {
      // 不使用 try...catch 的要求在全局，但此处需用户提示
      console.error("保存失败:", error)
      toast.error("保存失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  // 登录状态
  if (status === "loading") {
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

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle>需要登录</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">请先登录以创建您的提示词</p>
                <Button onClick={() => router.push("/auth/signin")}>前往登录</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // 所有标签（用于预览用 Badge）
  const previewTags = tags.map((t) => t.name)

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
              <div className="text-center w-full">
                <h1 className="text-3xl font-bold text-foreground">创建新提示词</h1>
                <p className="text-muted-foreground mt-1">分享你的高质量提示词，帮助更多人提升效率</p>
              </div>
            </div>
          </motion.div>

          {/* 导入栏 */}
          <Card className="mb-8 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="size-5" />
                <span>导入数据</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowImport((s) => !s)}
                  className="flex items-center space-x-2"
                >
                  <FileText className="size-4" />
                  <span>从JSON文本导入</span>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={handlePickFile}
                  className="flex items-center space-x-2"
                >
                  <Upload className="size-4" />
                  <span>从文件导入</span>
                </Button>
              </div>

              {showImport && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-3"
                >
                  <Textarea
                    placeholder="粘贴JSON数据..."
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="min-h-[120px] font-mono text-sm"
                  />
                  <div className="flex gap-2">
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

          {/* 主体：左编辑右预览（可切换） */}
          <div className={`grid gap-8 ${isPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* 左侧：编辑表单 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-6"
            >
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="size-5 text-primary" />
                      <span>提示词信息</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPreview((v) => !v)}
                        className="flex items-center space-x-2"
                      >
                        {isPreview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        <span>{isPreview ? "编辑" : "预览"}</span>
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2">
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
                  {/* 标题 */}
                  <div className="space-y-2">
                    <Label htmlFor="title">标题 *</Label>
                    <Input
                      id="title"
                      placeholder="为你的提示词起一个吸引人的标题..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50"
                      maxLength={100}
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
                      className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[100px] resize-none"
                      maxLength={500}
                    />
                  </div>

                  {/* 内容 */}
                  <div className="space-y-2">
                    <Label htmlFor="content">提示词内容 *</Label>
                    <Textarea
                      id="content"
                      placeholder="输入你的提示词内容（支持 Markdown）..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[240px] font-mono text-sm leading-relaxed"
                      maxLength={10000}
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
                    {previewTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {previewTags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 右侧：实时预览 */}
            {isPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm sticky top-8">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="size-5 text-primary" />
                      <span>实时预览</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">{title || "未设置标题"}</h2>
                      <p className="text-muted-foreground">{description || "未设置描述"}</p>
                    </div>

                    {previewTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {previewTags.map((tag, i) => (
                          <Badge key={i} className="text-sm">{tag}</Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="font-semibold">内容预览</h3>
                      <div className="max-h-[500px] overflow-y-auto">
                        {content ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {content}
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