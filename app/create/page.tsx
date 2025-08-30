"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Plus, Save, X } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SmartTagInput } from "@/components/smart-tag-input"
import { MarkdownEditor } from "@/components/markdown-editor"

// 智能标签类型定义
interface SmartTag {
  id: string
  name: string
  type?: string
  isCustom?: boolean
}

export default function CreatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<SmartTag[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    prompt: "",
    example: "",
    isPublic: true,
    allowComments: true,
  })

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        加载中...
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateCustomTag = (tagName: string): SmartTag => {
    return {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: tagName,
      type: "default",
      isCustom: true
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // 准备提交数据，包含智能标签信息
      const submitData = {
        ...formData,
        tags: tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          type: tag.type,
          isCustom: tag.isCustom
        }))
      }

      console.log("提交提示词:", submitData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/prompts")
    } catch (error) {
      console.error("提交失败:", error)
      alert("提交失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">创建提示词</h1>
        <p className="text-muted-foreground">
          分享你的创意提示词，帮助更多人提升AI使用体验
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 左侧编辑区域 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>
                填写提示词的基本信息，让其他用户更好地了解你的作品
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">标题 *</Label>
                  <Input
                    id="title"
                    placeholder="为你的提示词起一个吸引人的标题"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="writing">写作助手</SelectItem>
                      <SelectItem value="coding">编程开发</SelectItem>
                      <SelectItem value="design">设计创意</SelectItem>
                      <SelectItem value="business">商业分析</SelectItem>
                      <SelectItem value="education">教育学习</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述 *</Label>
                <Textarea
                  id="description"
                  placeholder="简要描述这个提示词的用途和特点"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>智能标签</Label>
                <SmartTagInput
                  tags={tags}
                  onTagsChange={setTags}
                  placeholder="输入标签名称，支持自定义创建..."
                  maxTags={10}
                  allowCustomTags={true}
                  onCreateCustomTag={handleCreateCustomTag}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>提示词内容</CardTitle>
              <CardDescription>
                使用Markdown格式编写你的提示词内容，支持实时预览
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">提示词内容 * (支持Markdown)</Label>
                <MarkdownEditor
                  value={formData.prompt}
                  onChange={(value) => handleInputChange("prompt", value)}
                  placeholder="在这里输入你的提示词内容，支持Markdown格式..."
                  height="400px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="example">使用示例 (支持Markdown)</Label>
                <MarkdownEditor
                  value={formData.example}
                  onChange={(value) => handleInputChange("example", value)}
                  placeholder="提供一个使用示例，帮助其他用户更好地理解..."
                  height="300px"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>发布设置</CardTitle>
              <CardDescription>
                设置提示词的可见性和交互选项
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>公开发布</Label>
                  <p className="text-sm text-muted-foreground">
                    允许其他用户查看和使用这个提示词
                  </p>
                </div>
                <Switch 
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>允许评论</Label>
                  <p className="text-sm text-muted-foreground">
                    允许其他用户对这个提示词进行评论
                  </p>
                </div>
                <Switch 
                  checked={formData.allowComments}
                  onCheckedChange={(checked) => handleInputChange("allowComments", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧预览和操作区域 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>预览</CardTitle>
              <CardDescription>
                查看你的提示词在平台上的显示效果
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {formData.title || "提示词标题"}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {formData.description || "这里会显示你输入的描述内容..."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? (
                      tags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className={tag.isCustom ? "ring-1 ring-primary/30" : ""}
                        >
                          {tag.name}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">示例标签</Badge>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">提示词内容：</p>
                  <p className="mt-1 text-sm text-muted-foreground font-mono">
                    {formData.prompt || "这里会显示你的提示词内容..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading || !formData.title || !formData.prompt}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    发布提示词
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 size-4" />
                预览效果
              </Button>
              <Button variant="ghost" className="w-full">
                保存草稿
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}