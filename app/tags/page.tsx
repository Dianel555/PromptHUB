"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Download,
  Filter,
  Languages,
  Plus,
  Search,
  Settings,
  Star,
  Tag as TagIcon,
  Upload,
  Zap,
} from "lucide-react"

import { SmartTagAnalyzer } from "@/lib/smart-tag-analyzer"
import { tagDimensions } from "@/lib/tag-system"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SmartTagEditor } from "@/components/smart-tag-editor"
import { TagFineTuning } from "@/components/tag-fine-tuning"
import { TagManagementPanel } from "@/components/tag-management-panel"
import {
  TagCloud,
  TagInput,
  ThemeAdaptiveTag,
  ThemeAdaptiveTagList,
} from "@/components/theme-adaptive-tag"

// 模拟数据
const mockPrompts = [
  {
    id: "1",
    title: "专业图像生成提示词",
    content:
      "创建令人惊叹的详细图像，包含风格指导和高级参数控制。适用于各种AI图像生成工具。",
    tags: ["图像", "艺术", "精选"],
    createdAt: new Date("2024-01-15"),
    author: "Alex Chen",
  },
  {
    id: "2",
    title: "高效内容创作助手",
    content:
      "高效的内容创作流程，适用于博客、文章和社交媒体的多功能写作提示词。",
    tags: ["内容", "写作"],
    createdAt: new Date("2024-01-14"),
    author: "Sarah Kim",
  },
  {
    id: "3",
    title: "代码调试专家",
    content: "高效识别和修复代码中的错误，支持多种编程语言的结构化调试提示词。",
    tags: ["代码", "开发"],
    createdAt: new Date("2024-01-13"),
    author: "Mike Johnson",
  },
]

const mockTagStats = [
  { id: "image", name: "图像", count: 156, dimension: "genre" },
  { id: "writing", name: "写作", count: 134, dimension: "genre" },
  { id: "code", name: "代码", count: 98, dimension: "genre" },
  { id: "creative", name: "创意", count: 87, dimension: "mood" },
  { id: "professional", name: "专业", count: 76, dimension: "mood" },
  { id: "technical", name: "技术", count: 65, dimension: "style" },
  { id: "artistic", name: "艺术", count: 54, dimension: "style" },
  { id: "business", name: "商业", count: 43, dimension: "scene" },
]

export default function TagsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDimension, setSelectedDimension] = useState<string>("all")
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisText, setAnalysisText] = useState("")
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  // 智能分析功能
  const handleSmartAnalysis = async () => {
    if (!analysisText.trim()) return

    setIsAnalyzing(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const results = await SmartTagAnalyzer.analyzeContent(analysisText)
      setAnalysisResults(results)
    } catch (error) {
      console.error("分析失败:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 过滤标签统计
  const filteredTagStats = mockTagStats.filter((tag) => {
    const matchesSearch = tag.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesDimension =
      selectedDimension === "all" || tag.dimension === selectedDimension
    return matchesSearch && matchesDimension
  })

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* 页面头部 */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            智能标签管理系统
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            优化内容创作提示词的标签分类，提升内容发现和管理效率
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher
            language={language}
            onLanguageChange={setLanguage}
            size="sm"
          />
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            导出标签
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 size-4" />
            导入标签
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="size-4" />
            概览
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Star className="size-4" />
            智能分析
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <TagIcon className="size-4" />
            标签管理
          </TabsTrigger>
          <TabsTrigger value="fine-tuning" className="flex items-center gap-2">
            <Settings className="size-4" />
            精细调优
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Plus className="size-4" />
            系统集成
          </TabsTrigger>
        </TabsList>

        {/* 概览页面 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总标签数</CardTitle>
                <TagIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% 较上月</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃标签</CardTitle>
                <Zap className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">69% 使用率</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">标签维度</CardTitle>
                <Filter className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tagDimensions.length}</div>
                <p className="text-xs text-muted-foreground">多维度分类</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">智能识别</CardTitle>
                <Languages className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">准确率</p>
              </CardContent>
            </Card>
          </div>

          {/* 搜索和过滤 */}
          <Card>
            <CardHeader>
              <CardTitle>标签浏览</CardTitle>
              <CardDescription>
                浏览和搜索所有标签，按维度进行分类查看
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <Input
                    placeholder="搜索标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedDimension}
                  onChange={(e) => setSelectedDimension(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">所有维度</option>
                  {tagDimensions.map((dimension) => (
                    <option key={dimension.id} value={dimension.id}>
                      {dimension.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 标签云 */}
              <TagCloud
                tags={filteredTagStats}
                theme="default"
                onTagClick={(tagId) => console.log("点击标签:", tagId)}
              />
            </CardContent>
          </Card>

          {/* 最近活动 */}
          <Card>
            <CardHeader>
              <CardTitle>最近标签活动</CardTitle>
              <CardDescription>查看最近创建和使用的标签</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {prompt.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {prompt.content.substring(0, 100)}...
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <ThemeAdaptiveTagList
                          tags={prompt.tags.map((tag) => ({
                            id: tag,
                            name: tag,
                          }))}
                          size="sm"
                          animated={false}
                        />
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{prompt.author}</div>
                      <div>{prompt.createdAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 智能分析页面 */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>智能内容分析</CardTitle>
              <CardDescription>
                输入内容，系统将自动识别主题、风格和情感基调，生成多维度标签
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <textarea
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  placeholder="请输入要分析的内容..."
                  className="h-32 w-full resize-none rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <Button
                  onClick={handleSmartAnalysis}
                  disabled={isAnalyzing || !analysisText.trim()}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                      分析中...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 size-4" />
                      开始智能分析
                    </>
                  )}
                </Button>
              </div>

              {/* 分析结果 */}
              {analysisResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <h3 className="text-lg font-semibold">分析结果</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">主题识别</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResults.themes?.map(
                            (theme: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm">{theme.name}</span>
                                <Badge variant="secondary">
                                  {(theme.confidence * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">情感分析</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResults.emotions?.map(
                            (emotion: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm">{emotion.name}</span>
                                <Badge variant="secondary">
                                  {(emotion.confidence * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">风格识别</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResults.styles?.map(
                            (style: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm">{style.name}</span>
                                <Badge variant="secondary">
                                  {(style.confidence * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">推荐标签</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ThemeAdaptiveTagList
                        tags={
                          analysisResults.recommendedTags?.map((tag: any) => ({
                            id: tag.name,
                            name: tag.name,
                            confidence: tag.confidence,
                            dimension: tag.dimension,
                          })) || []
                        }
                        animated={true}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 标签管理页面 */}
        <TabsContent value="management">
          <TagManagementPanel />
        </TabsContent>

        {/* 精细调优页面 */}
        <TabsContent value="fine-tuning">
          <TagFineTuning
            tags={mockTagStats.map((tag) => ({
              id: tag.id,
              name: tag.name,
              nameEn: tag.name, // 临时使用中文名作为英文名
              dimension: tag.dimension,
              confidence: 0.8,
              color: "#3b82f6",
              weight: 1.0,
              keywords: [tag.name],
              isActive: true,
              category: "default",
            }))}
            onTagsChange={(tags) => console.log("标签更新:", tags)}
            language={language}
          />
        </TabsContent>

        {/* 系统集成页面 */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>系统集成配置</CardTitle>
              <CardDescription>
                配置标签系统与现有内容管理平台的集成设置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">API 集成</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">API 端点</label>
                      <Input placeholder="https://api.example.com/tags" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">认证密钥</label>
                      <Input type="password" placeholder="输入API密钥" />
                    </div>
                    <Button size="sm">测试连接</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">同步设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">自动同步</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">实时更新</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">同步频率</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                        <option>每小时</option>
                        <option>每天</option>
                        <option>每周</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">集成状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">
                          内容管理系统
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        已连接
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">
                          智能分析服务
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        运行中
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-medium">外部API</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        配置中
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}