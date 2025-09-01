"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Grid, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PromptCard } from "@/components/prompt-card"
import { getUserPrompts, getUserStats, type Prompt } from "@/lib/prompt-storage"

export default function PromptsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [stats, setStats] = useState({ totalPrompts: 0, totalLikes: 0, totalViews: 0 })

  useEffect(() => {
    // 加载用户的提示词和统计数据
    const userPrompts = getUserPrompts()
    const userStats = getUserStats()
    setPrompts(userPrompts)
    setStats(userStats)
  }, [])

  // 获取所有标签
  const allTags = Array.from(new Set(prompts.flatMap(prompt => prompt.tags)))

  // 过滤提示词
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => prompt.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  我的提示词库
                </h1>
                <p className="text-muted-foreground text-lg">
                  管理和编辑您创建的AI提示词
                </p>
              </div>
              <Button 
                onClick={() => router.push("/create")}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="size-4 mr-2" />
                创建新提示词
              </Button>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalPrompts}
                  </div>
                  <div className="text-sm text-muted-foreground">总提示词数</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.totalLikes}
                  </div>
                  <div className="text-sm text-muted-foreground">总获赞数</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">总浏览量</div>
                </CardContent>
              </Card>
            </div>

            {/* 搜索和过滤 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    placeholder="搜索提示词..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>

            {/* 标签过滤 */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  标签筛选:
                </span>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="text-xs h-6"
                  >
                    清除筛选
                  </Button>
                )}
              </div>
            )}
          </motion.div>

          {/* 提示词列表 */}
          {filteredPrompts.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PromptCard
                    id={prompt.id}
                    title={prompt.title}
                    description={prompt.description}
                    content={prompt.content}
                    author={prompt.author}
                    tags={prompt.tags}
                    likes={prompt.likes}
                    comments={prompt.comments}
                    views={prompt.views}
                    createdAt={prompt.createdAt}
                    isLiked={false}
                    isOwner={true}
                    className={viewMode === "list" ? "max-w-none" : ""}
                    showPreview={viewMode === "list"}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchTerm || selectedTags.length > 0 
                  ? "没有找到匹配的提示词" 
                  : "还没有创建任何提示词"
                }
              </div>
              <Button onClick={() => router.push("/create")}>
                <Plus className="size-4 mr-2" />
                创建第一个提示词
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}