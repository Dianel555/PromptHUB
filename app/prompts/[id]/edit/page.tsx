"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SmartTagInput } from "@/components/smart-tag-input"
import { MarkdownEditor } from "@/components/markdown-editor"
import { toast } from "sonner"
import { type TagType } from "@/lib/enhanced-tag-system"

// 智能标签类型定义
interface SmartTag {
  id: string
  name: string
  type?: TagType
  isCustom?: boolean
}

interface PromptData {
  id: string
  title: string
  description: string
  prompt: string
  example: string
  tags: SmartTag[]
  isPublic: boolean
  category: string
}

// 模拟获取提示词数据的函数
const getPromptData = (id: string): PromptData | null => {
  // 这里应该从API获取数据，现在使用模拟数据
  const mockData: Record<string, PromptData> = {
    "1": {
      id: "1",
      title: "AI图像生成专家",
      description: "创建令人惊叹的详细图像，包含风格修饰符、构图指南和高级参数控制。",
      prompt: "# AI图像生成专家提示词\n\n你是一个专业的AI图像生成专家。请根据用户的需求，生成详细的图像描述。\n\n## 要求：\n1. 包含具体的风格描述\n2. 详细的构图指南\n3. 色彩和光影效果\n4. 技术参数建议",
      example: "**用户输入：** 生成一个科幻城市的图像\n\n**输出：** 未来科幻城市，赛博朋克风格，霓虹灯闪烁的摩天大楼，飞行汽车穿梭其间，夜晚场景，蓝紫色调为主，戏剧性光影效果，超高清8K分辨率，电影级构图",
      tags: [
        { id: "1", name: "图像生成", type: "category" },
        { id: "2", name: "AI工具", type: "skill" },
        { id: "3", name: "创意设计", type: "content" }
      ],
      isPublic: true,
      category: "创意设计"
    }
  }
  
  return mockData[id] || null
}

export default function EditPromptPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [tags, setTags] = useState<SmartTag[]>([])
  const [formData, setFormData] = useState<Omit<PromptData, 'id' | 'tags'>>({
    title: "",
    description: "",
    prompt: "",
    example: "",
    isPublic: true,
    category: "通用"
  })

  const promptId = params.id as string

  // 加载提示词数据
  useEffect(() => {
    const loadPromptData = async () => {
      setIsDataLoading(true)
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const data = getPromptData(promptId)
        if (data) {
          setFormData({
            title: data.title,
            description: data.description,
            prompt: data.prompt,
            example: data.example,
            isPublic: data.isPublic,
            category: data.category
          })
          setTags(data.tags)
        } else {
          toast.error("提示词不存在")
          router.push("/prompts")
        }
      } catch (error) {
        toast.error("加载失败")
        router.push("/prompts")
      } finally {
        setIsDataLoading(false)
      }
    }

    if (promptId) {
      loadPromptData()
    }
  }, [promptId, router])

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateCustomTag = (tagName: string): SmartTag => {
    return {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: tagName,
      type: "default",
      isCustom: true
    }
  }

  const handleSave = async () => {
    if (!session) {
      toast.error("请先登录")
      return
    }

    if (!formData.title.trim() || !formData.prompt.trim()) {
      toast.error("请填写标题和提示词内容")
      return
    }

    setIsLoading(true)
    try {
      // 准备提交数据
      const submitData = {
        ...formData,
        tags: tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          type: tag.type,
          isCustom: tag.isCustom
        }))
      }
      
      console.log("更新提示词:", submitData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("提示词已更新")
      router.push("/prompts")
    } catch (error) {
      console.error("更新失败:", error)
      toast.error("更新失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">请先登录</h1>
          <Button onClick={() => router.push("/auth/signin")}>
            前往登录
          </Button>
        </div>
      </div>
    )
  }

  if (isDataLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="size-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* 头部 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 size-4" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold">编辑提示词</h1>
            <p className="text-muted-foreground mt-2">
              修改您的提示词内容和设置
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              保存更改
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              设置提示词的标题、描述和分类
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  placeholder="输入提示词标题"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Input
                  id="category"
                  placeholder="例如：写作、编程、设计"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                />
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

        {/* 提示词内容 */}
        <Card>
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

        {/* 发布设置 */}
        <Card>
          <CardHeader>
            <CardTitle>发布设置</CardTitle>
            <CardDescription>
              控制提示词的可见性和访问权限
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
