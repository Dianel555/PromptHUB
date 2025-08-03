import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, X, Save, Eye } from 'lucide-react'
import { SmartTagEditor } from '@/components/smart-tag-editor'
import { ThemeAdaptiveTagList, ThemeAdaptiveTag } from '@/components/theme-adaptive-tag'

// 彩色标签组件
function ColorfulTag({ children }: { children: React.ReactNode }) {
  return (
    <ThemeAdaptiveTag
      variant="solid"
      size="sm"
      dimension="genre"
      animated={true}
    >
      {children}
    </ThemeAdaptiveTag>
  )
}

async function CreatePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col gap-6">
        {/* 页面标题 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">创建提示词</h1>
          <p className="text-muted-foreground">
            分享你的优质提示词，帮助更多人提升AI使用体验
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要编辑区域 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>填写提示词的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">标题 *</Label>
                  <Input
                    id="title"
                    placeholder="为你的提示词起一个吸引人的标题"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">描述 *</Label>
                  <Textarea
                    id="description"
                    placeholder="简要描述这个提示词的用途和特点"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Select>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>提示词内容</CardTitle>
                <CardDescription>输入你的提示词内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">提示词 *</Label>
                  <Textarea
                    id="prompt"
                    placeholder="在这里输入你的提示词内容..."
                    className="min-h-[200px] font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="example">使用示例</Label>
                  <Textarea
                    id="example"
                    placeholder="提供一个使用示例，帮助其他用户更好地理解"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>标签和设置</CardTitle>
                <CardDescription>添加标签并配置发布设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>智能标签系统</Label>
                  <SmartTagEditor
                    content=""
                    onTagsChange={(tags) => console.log('标签更新:', tags)}
                    language="zh"
                    showSuggestions={true}
                  />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">预设标签示例：</p>
                    <ThemeAdaptiveTagList
                      tags={[
                        { id: '1', name: 'AI助手', dimension: 'genre' },
                        { id: '2', name: '创意写作', dimension: 'genre' },
                        { id: '3', name: '效率工具', dimension: 'style' }
                      ]}
                      size="sm"
                      animated={true}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>公开发布</Label>
                    <p className="text-sm text-muted-foreground">
                      允许其他用户查看和使用这个提示词
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>允许评论</Label>
                    <p className="text-sm text-muted-foreground">
                      允许其他用户对这个提示词进行评论
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏预览 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">预览</CardTitle>
                <CardDescription>查看发布后的效果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">提示词标题</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      这里会显示你输入的描述内容...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <ColorfulTag>示例标签</ColorfulTag>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                        {session?.user?.name?.[0] || 'U'}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {session?.user?.name || '用户'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      刚刚创建
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">发布操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  发布提示词
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  预览效果
                </Button>
                <Button variant="ghost" className="w-full">
                  保存草稿
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">创建提示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• 标题要简洁明了，突出提示词的核心功能</p>
                  <p>• 描述要详细说明使用场景和预期效果</p>
                  <p>• 添加相关标签有助于其他用户发现</p>
                  <p>• 提供使用示例能帮助用户更好理解</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatePageWrapper() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      {/* @ts-expect-error Server Component */}
      <CreatePage />
    </Suspense>
  )
}
