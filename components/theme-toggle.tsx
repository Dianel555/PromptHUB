"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Clock, Eye, FileText, Monitor, Moon, Star, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

const themeConfigs = {
  light: { name: "light", displayName: "白天模式", icon: "🌞" },
  dark: { name: "dark", displayName: "黑夜模式", icon: "🌙" },
  system: { name: "system", displayName: "跟随系统", icon: "💻" },
  paper: { name: "paper", displayName: "纸质模式", icon: "📄" },
  eyecare: { name: "eyecare", displayName: "护眼模式", icon: "👁️" },
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 性能优化：使用 useCallback 避免重复渲染
  const handleThemeChange = useCallback(
    (newTheme: string) => {
      // 防止快速连续点击和重复设置
      if (newTheme === theme || isChanging) return

      setIsChanging(true)

      // 立即关闭下拉菜单
      setIsOpen(false)

      // 添加过渡动画类
      document.documentElement.classList.add("theme-transitioning")

      // 使用 requestAnimationFrame 确保状态更新的时机
      requestAnimationFrame(() => {
        setTheme(newTheme as any)

        // 移除过渡类和重置状态
        setTimeout(() => {
          document.documentElement.classList.remove("theme-transitioning")
          setIsChanging(false)
        }, 300)
      })
    },
    [setTheme, theme, isChanging]
  )

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="border border-border bg-background/10 backdrop-blur-md hover:bg-background/20"
        disabled
      >
        <span className="text-lg">💻</span>
        <span className="sr-only">切换主题</span>
      </Button>
    )
  }

  const currentTheme = themeConfigs[theme as keyof typeof themeConfigs]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative z-50 border border-border bg-background/10 backdrop-blur-md hover:bg-background/20"
        >
          <span className="text-lg">{currentTheme?.icon || "💻"}</span>
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border border-border bg-background/95 shadow-lg backdrop-blur-md"
        sideOffset={5}
        onCloseAutoFocus={(e) => e.preventDefault()}
        avoidCollisions={true}
        collisionPadding={20}
        style={{ zIndex: 99999 }}
      >
        {Object.values(themeConfigs).map((themeConfig) => (
          <DropdownMenuItem
            key={themeConfig.name}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleThemeChange(themeConfig.name)
            }}
            className="flex cursor-pointer items-center gap-2 hover:bg-accent focus:bg-accent"
          >
            <span className="text-lg">{themeConfig.icon}</span>
            <span>{themeConfig.displayName}</span>
            {theme === themeConfig.name && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
