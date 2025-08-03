import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Heart, Eye, User } from 'lucide-react'
import { ColorfulTag } from '@/components/colorful-tag'

// 模拟数据
const mockPrompts = [
  {
    id: 1,
    title: 'AI图像生成专家',
    description: '创建令人惊叹的详细图像，包含风格指导和高级参数控制。适用于各种AI图像生成工具。',
    tags: ['艺术', '设计', '精选'],
    author: 'Alex Chen',
    likes: 1250,
    views: 8900,
    avatar: 'A'
  },
  {
    id: 2,
    title: '内容写作助手',
    description: '高效的内容创作流程，适用于博客、文章和社交媒体的多功能写作提示词。',
    tags: ['内容', '写作'],
    author: 'Sarah Kim',
    likes: 890,
    views: 5600,
    avatar: 'S'
  },
  {
    id: 3,
    title: '代码调试器',
    description: '高效识别和修复代码中的错误，支持多种编程语言的结构化调试提示词。',
    tags: ['代码', '开发'],
    author: 'Mike Johnson',
    likes: 2100,
    views: 12000,
    avatar: 'M'
  }
]

async function PromptsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* 页面标题 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">探索提示词</h1>
          <p className="text-muted-foreground">
            发现社区分享的优质提示词，提升你的AI使用体验
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索提示词..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            筛选
          </Button>
        </div>

        {/* 提示词列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPrompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                      {prompt.description}
                    </CardDescription>
                  </div>
                </div>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {prompt.tags.map((tag) => (
                    <ColorfulTag key={tag}>
                      {tag}
                    </ColorfulTag>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* 作者和统计信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {prompt.avatar}
                    </div>
                    <span className="text-sm text-muted-foreground">{prompt.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{prompt.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{prompt.views}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 加载更多 */}
        <div className="flex justify-center mt-8">
          <Button variant="outline">加载更多</Button>
        </div>
      </div>
    </div>
  )
}

export default function PromptsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <PromptsPage />
    </Suspense>
  )
}