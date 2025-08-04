"use client"

import { useState } from "react"

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
import { ColorfulTag, TagList } from "@/components/colorful-tag"
import { MarkdownEditor } from "@/components/markdown-editor"
import { ThemeToggle } from "@/components/theme-toggle"

const sampleTags = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "UI/UX",
  "JavaScript",
  "CSS",
  "HTML",
  "Node.js",
  "API",
  "Database",
  "Frontend",
  "Backend",
  "Full Stack",
]

const sampleMarkdown = String.raw`# PromptHUB 功能演示

## 多彩标签系统
标签会根据内容自动分配颜色，确保视觉多样性。

## Markdown实时预览
支持完整的Markdown语法，包括：

### 代码高亮
\
function hello() {
  console.log('Hello, PromptHUB!');
}
\

### 表格支持
| 功能 | 状态 | 描述 |
|------|------|------|
| 多主题 | ✅ | 支持5种主题模式 |
| 标签系统 | ✅ | 12种颜色自动分配 |
| Markdown | ✅ | 实时预览渲染 |

### 引用块
> 这是一个引用块示例，展示了主题适配效果。

### 列表
- 白天模式 🌞
- 黑夜模式 🌙  
- 护眼模式 👁️
- 纸质模式 📄
- 星空模式 ⭐

**粗体文本** 和 *斜体文本* 也完美支持主题切换。
`

export default function DemoPage() {
  const [markdownContent, setMarkdownContent] = useState(sampleMarkdown)

  return (
    <div className="min-h-screen bg-background">
      {/* 头部导航 */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-gradient text-xl font-bold">PromptHUB</h1>
            <Badge variant="secondary" className="text-xs">
              功能演示
            </Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto space-y-8 p-6">
        {/* 欢迎区域 */}
        <div className="space-y-4 text-center">
          <h1 className="text-gradient text-4xl font-bold">
            PromptHUB UI 整合演示
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            体验全新的多主题系统、多彩标签和Markdown实时预览功能
          </p>
        </div>

        {/* 主题切换演示 */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 多主题系统演示
            </CardTitle>
            <CardDescription>
              点击右上角的主题切换器，体验5种不同的主题模式
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">🌞 白天模式</h3>
                <p className="text-sm text-muted-foreground">
                  清爽明亮，适合日间使用
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">🌙 黑夜模式</h3>
                <p className="text-sm text-muted-foreground">
                  深色护眼，适合夜间使用
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">👁️ 护眼模式</h3>
                <p className="text-sm text-muted-foreground">
                  温暖橙色，减少眼部疲劳
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">📄 纸质模式</h3>
                <p className="text-sm text-muted-foreground">
                  仿纸张质感，复古典雅
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">⭐ 星空模式</h3>
                <p className="text-sm text-muted-foreground">
                  梦幻星空，动态背景效果
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">🤖 智能切换</h3>
                <p className="text-sm text-muted-foreground">
                  根据时间自动切换主题
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 多彩标签演示 */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏷️ 多彩标签系统演示
            </CardTitle>
            <CardDescription>
              标签会根据内容自动分配颜色，同样内容的标签在不同主题下保持一致
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-3 font-semibold">技术标签示例：</h3>
              <TagList tags={sampleTags} className="mb-4" />
            </div>

            <div>
              <h3 className="mb-3 font-semibold">单个标签示例：</h3>
              <div className="flex flex-wrap gap-2">
                <ColorfulTag>前端开发</ColorfulTag>
                <ColorfulTag>后端开发</ColorfulTag>
                <ColorfulTag>全栈开发</ColorfulTag>
                <ColorfulTag>UI设计</ColorfulTag>
                <ColorfulTag>用户体验</ColorfulTag>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                💡
                提示：相同内容的标签会显示相同颜色，不同内容会自动分配不同颜色，确保视觉层次清晰。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Markdown编辑器演示 */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 Markdown实时预览演示
            </CardTitle>
            <CardDescription>
              左侧编辑，右侧实时预览，支持代码高亮、表格、引用等完整Markdown语法
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={markdownContent}
              onChange={setMarkdownContent}
              height="600px"
            />
          </CardContent>
        </Card>

        {/* 玻璃拟态效果演示 */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ 玻璃拟态效果演示
            </CardTitle>
            <CardDescription>
              所有卡片都采用半透明背景和模糊效果，在不同主题下呈现不同的视觉效果
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="glass rounded-lg border p-6 backdrop-blur-md">
                <h3 className="mb-2 font-semibold">玻璃效果卡片 1</h3>
                <p className="text-sm text-muted-foreground">
                  这是一个带有玻璃拟态效果的卡片，具有半透明背景和模糊效果。
                </p>
                <Button className="glass-button mt-3">玻璃按钮</Button>
              </div>
              <div className="glass rounded-lg border p-6 backdrop-blur-md">
                <h3 className="mb-2 font-semibold">玻璃效果卡片 2</h3>
                <p className="text-sm text-muted-foreground">
                  在不同主题下，玻璃效果会自动适配，保持最佳的视觉效果。
                </p>
                <Input
                  placeholder="玻璃输入框"
                  className="mt-3 bg-input/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 功能总结 */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 功能总结
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold">✅ 已完成功能</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-500"></span>
                    多主题色彩系统（5种主题）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-500"></span>
                    智能主题切换（时间自动切换）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-500"></span>
                    多彩标签系统（12种颜色）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-500"></span>
                    Markdown实时预览编辑器
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-500"></span>
                    玻璃拟态效果适配
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold">🔧 技术特性</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500"></span>
                    响应式设计，完美适配移动端
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500"></span>
                    平滑过渡动画效果
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500"></span>
                    代码高亮和表格渲染
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500"></span>
                    用户偏好设置持久化
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500"></span>
                    TypeScript类型安全
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
