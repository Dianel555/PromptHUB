"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { themes } from "@/lib/themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      themes={Object.keys(themes)}
      enableSystem={false}
      disableTransitionOnChange={false}
      {...props}
    >
      <ThemeStyleInjector />
      {children}
    </NextThemesProvider>
  )
}

// 动态注入主题样式
function ThemeStyleInjector() {
  const [theme, setTheme] = React.useState<string>('light')

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const currentTheme = document.documentElement.className.split(' ').find(cls => 
            Object.keys(themes).includes(cls)
          ) || 'light'
          setTheme(currentTheme)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // 初始化主题
    const initialTheme = document.documentElement.className.split(' ').find(cls => 
      Object.keys(themes).includes(cls)
    ) || 'light'
    setTheme(initialTheme)

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const themeConfig = themes[theme as keyof typeof themes]
    if (!themeConfig) return

    // 创建CSS变量
    const root = document.documentElement
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // 特殊处理星空主题的背景渐变
    if (theme === 'starry') {
      root.style.setProperty('--background', themeConfig.colors.background)
      document.body.style.background = themeConfig.colors.background
    } else {
      document.body.style.background = themeConfig.colors.background
    }
  }, [theme])

  return null
}
