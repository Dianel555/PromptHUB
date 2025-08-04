"use client"

import { useCallback, useRef, useState } from "react"
import {
  Bold,
  Code,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "在此输入Markdown内容...",
  className,
  height = "500px",
}: MarkdownEditorProps) {
  const { theme } = useTheme()
  const [showPreview, setShowPreview] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end)

      onChange(newText)

      // 重新设置光标位置
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        )
      }, 0)
    },
    [value, onChange]
  )

  const toolbarButtons = [
    { icon: Bold, label: "粗体", action: () => insertText("**", "**") },
    { icon: Italic, label: "斜体", action: () => insertText("*", "*") },
    { icon: Heading1, label: "标题1", action: () => insertText("# ") },
    { icon: Heading2, label: "标题2", action: () => insertText("## ") },
    { icon: List, label: "无序列表", action: () => insertText("- ") },
    { icon: ListOrdered, label: "有序列表", action: () => insertText("1. ") },
    { icon: Link, label: "链接", action: () => insertText("[", "](url)") },
    { icon: Image, label: "图片", action: () => insertText("![", "](url)") },
    { icon: Code, label: "代码", action: () => insertText("`", "`") },
  ]

  const isDarkTheme = theme === "dark" || theme === "starry"

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border bg-card/80 backdrop-blur-md",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* 工具栏 */}
      <div className="flex items-center justify-between border-b bg-muted/50 p-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              className="size-8 p-0"
              title={button.label}
            >
              <button.icon className="size-4" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 px-2"
            title={showPreview ? "隐藏预览" : "显示预览"}
          >
            {showPreview ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
            <span className="ml-1 text-xs">预览</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="size-8 p-0"
            title={isFullscreen ? "退出全屏" : "全屏编辑"}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 编辑器内容区域 */}
      <div
        className="flex"
        style={{ height: isFullscreen ? "calc(100vh - 60px)" : height }}
      >
        {/* 编辑器 */}
        <div className={cn("flex flex-1 flex-col", showPreview && "border-r")}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full flex-1 resize-none border-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none"
            style={{ minHeight: "100%" }}
          />
        </div>

        {/* 预览区域 */}
        {showPreview && (
          <div className="flex-1 overflow-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none p-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "")
                    const isInline = props.inline
                    return !isInline && match ? (
                      <SyntaxHighlighter
                        style={isDarkTheme ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-border">
                          {children}
                        </table>
                      </div>
                    )
                  },
                  th({ children }) {
                    return (
                      <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                        {children}
                      </th>
                    )
                  },
                  td({ children }) {
                    return (
                      <td className="border border-border px-4 py-2">
                        {children}
                      </td>
                    )
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="rounded-r border-l-4 border-primary bg-muted/50 py-2 pl-4 italic">
                        {children}
                      </blockquote>
                    )
                  },
                }}
              >
                {value || "*在左侧编辑器中输入内容，这里将显示实时预览效果*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 简化版本的Markdown编辑器，用于快速集成
export function SimpleMarkdownEditor({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <Card className={cn("p-4", className)}>
      <MarkdownEditor value={value} onChange={onChange} height="300px" />
    </Card>
  )
}