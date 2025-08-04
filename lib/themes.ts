export interface ThemeConfig {
  name: string
  displayName: string
  displayNameEn: string
  icon: string
  description: string
  descriptionEn: string
  colors: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
    glass: string
    glassHover: string
  }
  // 主题特定的标签样式配置
  tagStyles: {
    defaultOpacity: number
    hoverOpacity: number
    borderRadius: string
    fontSize: {
      small: string
      medium: string
      large: string
    }
  }
}

export const themes: Record<string, ThemeConfig> = {
  light: {
    name: "light",
    displayName: "白天模式",
    displayNameEn: "Day Mode",
    icon: "🌞",
    description: "明亮清爽的白色主题，适合白天使用",
    descriptionEn: "Bright and clean white theme, perfect for daytime use",
    colors: {
      background: "#ffffff",
      foreground: "#0f172a",
      card: "#ffffff",
      cardForeground: "#0f172a",
      popover: "#ffffff",
      popoverForeground: "#0f172a",
      primary: "#3b82f6",
      primaryForeground: "#f8fafc",
      secondary: "#f1f5f9",
      secondaryForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      accent: "#f1f5f9",
      accentForeground: "#0f172a",
      destructive: "#ef4444",
      destructiveForeground: "#f8fafc",
      border: "#e2e8f0",
      input: "#e2e8f0",
      ring: "#3b82f6",
      glass: "rgba(255, 255, 255, 0.1)",
      glassHover: "rgba(255, 255, 255, 0.2)",
    },
    tagStyles: {
      defaultOpacity: 0.9,
      hoverOpacity: 1.0,
      borderRadius: "0.5rem",
      fontSize: {
        small: "0.75rem",
        medium: "0.875rem",
        large: "1rem",
      },
    },
  },
  dark: {
    name: "dark",
    displayName: "黑夜模式",
    displayNameEn: "Night Mode",
    icon: "🌙",
    description: "深色护眼主题，适合夜晚和低光环境使用",
    descriptionEn:
      "Dark eye-friendly theme, perfect for nighttime and low-light environments",
    colors: {
      background: "#0f172a",
      foreground: "#f8fafc",
      card: "#1e293b",
      cardForeground: "#f8fafc",
      popover: "#1e293b",
      popoverForeground: "#f8fafc",
      primary: "#06b6d4",
      primaryForeground: "#0f172a",
      secondary: "#334155",
      secondaryForeground: "#f8fafc",
      muted: "#334155",
      mutedForeground: "#94a3b8",
      accent: "#334155",
      accentForeground: "#f8fafc",
      destructive: "#ef4444",
      destructiveForeground: "#f8fafc",
      border: "#334155",
      input: "#334155",
      ring: "#06b6d4",
      glass: "rgba(15, 23, 42, 0.1)",
      glassHover: "rgba(15, 23, 42, 0.2)",
    },
    tagStyles: {
      defaultOpacity: 0.85,
      hoverOpacity: 1.0,
      borderRadius: "0.5rem",
      fontSize: {
        small: "0.75rem",
        medium: "0.875rem",
        large: "1rem",
      },
    },
  },
  eyecare: {
    name: "eyecare",
    displayName: "护眼模式",
    displayNameEn: "Eye-care Mode",
    icon: "👁️",
    description:
      "通过调整屏幕亮度、色温和减少蓝光辐射来提高阅读舒适度，减少长时间使用电子设备对眼睛的刺激",
    descriptionEn:
      "Improves reading comfort by adjusting screen brightness, color temperature, and reducing blue light radiation to minimize eye strain from prolonged electronic device use",
    colors: {
      background: "#f8faf8",
      foreground: "#2d4a2d",
      card: "#ffffff",
      cardForeground: "#2d4a2d",
      popover: "#ffffff",
      popoverForeground: "#2d4a2d",
      primary: "#16a34a",
      primaryForeground: "#f0fdf4",
      secondary: "#f0fdf4",
      secondaryForeground: "#166534",
      muted: "#f0fdf4",
      mutedForeground: "#15803d",
      accent: "#dcfce7",
      accentForeground: "#166534",
      destructive: "#dc2626",
      destructiveForeground: "#fef2f2",
      border: "#bbf7d0",
      input: "#dcfce7",
      ring: "#16a34a",
      glass: "rgba(248, 250, 248, 0.8)",
      glassHover: "rgba(248, 250, 248, 0.9)",
    },
    tagStyles: {
      defaultOpacity: 0.9,
      hoverOpacity: 1.0,
      borderRadius: "0.5rem",
      fontSize: {
        small: "0.75rem",
        medium: "0.875rem",
        large: "1rem",
      },
    },
  },
  paper: {
    name: "paper",
    displayName: "纸质模式",
    displayNameEn: "Paper Mode",
    icon: "📄",
    description:
      "在护眼模式基础上增加模拟纸张纹理和色彩的功能，提供接近纸质阅读的体验，特别适合长时间电子书阅读或网页浏览",
    descriptionEn:
      "Based on eye-care mode with added paper texture and color simulation, providing a near-paper reading experience, especially suitable for long-term e-book reading or web browsing",
    colors: {
      background: "#faf7f0",
      foreground: "#3a2f1f",
      card: "#fefdfb",
      cardForeground: "#3a2f1f",
      popover: "#fefdfb",
      popoverForeground: "#3a2f1f",
      primary: "#92400e",
      primaryForeground: "#fef7ed",
      secondary: "#fef7ed",
      secondaryForeground: "#92400e",
      muted: "#fef7ed",
      mutedForeground: "#a16207",
      accent: "#fed7aa",
      accentForeground: "#92400e",
      destructive: "#dc2626",
      destructiveForeground: "#fef2f2",
      border: "#fed7aa",
      input: "#fde68a",
      ring: "#92400e",
      glass: "rgba(250, 247, 240, 0.85)",
      glassHover: "rgba(250, 247, 240, 0.95)",
    },
    tagStyles: {
      defaultOpacity: 0.95,
      hoverOpacity: 1.0,
      borderRadius: "0.375rem",
      fontSize: {
        small: "0.75rem",
        medium: "0.875rem",
        large: "1rem",
      },
    },
  },
  starry: {
    name: "starry",
    displayName: "星空模式",
    displayNameEn: "Starry Mode",
    icon: "⭐",
    description: "梦幻紫色星空主题，营造浪漫氛围",
    descriptionEn:
      "Dreamy purple starry theme that creates a romantic atmosphere",
    colors: {
      background: "#1e1b4b",
      foreground: "#e0e7ff",
      card: "#312e81",
      cardForeground: "#e0e7ff",
      popover: "#312e81",
      popoverForeground: "#e0e7ff",
      primary: "#a855f7",
      primaryForeground: "#1e1b4b",
      secondary: "#4c1d95",
      secondaryForeground: "#e0e7ff",
      muted: "#4c1d95",
      mutedForeground: "#c4b5fd",
      accent: "#4c1d95",
      accentForeground: "#e0e7ff",
      destructive: "#f87171",
      destructiveForeground: "#1e1b4b",
      border: "#6d28d9",
      input: "#6d28d9",
      ring: "#a855f7",
      glass: "rgba(30, 27, 75, 0.2)",
      glassHover: "rgba(30, 27, 75, 0.3)",
    },
    tagStyles: {
      defaultOpacity: 0.9,
      hoverOpacity: 1.0,
      borderRadius: "0.5rem",
      fontSize: {
        small: "0.75rem",
        medium: "0.875rem",
        large: "1rem",
      },
    },
  },
}

export const getTheme = (themeName: string): ThemeConfig => {
  return themes[themeName] || themes.light
}

export const getThemeNames = (): string[] => {
  return Object.keys(themes)
}

export const getThemeDisplayName = (
  themeName: string,
  language: "zh" | "en" = "zh"
): string => {
  const theme = getTheme(themeName)
  return language === "zh" ? theme.displayName : theme.displayNameEn
}

export const getThemeDescription = (
  themeName: string,
  language: "zh" | "en" = "zh"
): string => {
  const theme = getTheme(themeName)
  return language === "zh" ? theme.description : theme.descriptionEn
}

// 应用主题到文档根元素
export const applyTheme = (themeName: string) => {
  if (typeof document === "undefined") return

  const theme = getTheme(themeName)
  const root = document.documentElement

  // 移除所有主题类
  getThemeNames().forEach((name) => {
    root.classList.remove(name)
  })

  // 添加当前主题类
  root.classList.add(themeName)

  // 强制触发重新渲染
  root.style.display = "none"
  root.offsetHeight // 触发重排
  root.style.display = ""

  // 设置CSS变量（作为备用）
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })

  // 设置标签样式变量
  Object.entries(theme.tagStyles).forEach(([key, value]) => {
    if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        root.style.setProperty(`--tag-${key}-${subKey}`, subValue)
      })
    } else {
      root.style.setProperty(`--tag-${key}`, value.toString())
    }
  })
}

// 获取当前时间对应的自动主题
export const getAutoTheme = (): string => {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? "light" : "dark"
}

// 标签颜色配置
const tagColorPalettes = {
  light: [
    {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      shadow: "shadow-blue-100/50",
    },
    {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      shadow: "shadow-green-100/50",
    },
    {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
      shadow: "shadow-purple-100/50",
    },
    {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
      shadow: "shadow-orange-100/50",
    },
    {
      bg: "bg-pink-100",
      text: "text-pink-800",
      border: "border-pink-200",
      shadow: "shadow-pink-100/50",
    },
    {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      border: "border-indigo-200",
      shadow: "shadow-indigo-100/50",
    },
    {
      bg: "bg-teal-100",
      text: "text-teal-800",
      border: "border-teal-200",
      shadow: "shadow-teal-100/50",
    },
    {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      shadow: "shadow-red-100/50",
    },
  ],
  dark: [
    {
      bg: "bg-blue-900/50",
      text: "text-blue-200",
      border: "border-blue-700",
      shadow: "shadow-blue-900/30",
    },
    {
      bg: "bg-green-900/50",
      text: "text-green-200",
      border: "border-green-700",
      shadow: "shadow-green-900/30",
    },
    {
      bg: "bg-purple-900/50",
      text: "text-purple-200",
      border: "border-purple-700",
      shadow: "shadow-purple-900/30",
    },
    {
      bg: "bg-orange-900/50",
      text: "text-orange-200",
      border: "border-orange-700",
      shadow: "shadow-orange-900/30",
    },
    {
      bg: "bg-pink-900/50",
      text: "text-pink-200",
      border: "border-pink-700",
      shadow: "shadow-pink-900/30",
    },
    {
      bg: "bg-indigo-900/50",
      text: "text-indigo-200",
      border: "border-indigo-700",
      shadow: "shadow-indigo-900/30",
    },
    {
      bg: "bg-teal-900/50",
      text: "text-teal-200",
      border: "border-teal-700",
      shadow: "shadow-teal-900/30",
    },
    {
      bg: "bg-red-900/50",
      text: "text-red-200",
      border: "border-red-700",
      shadow: "shadow-red-900/30",
    },
  ],
  eyecare: [
    {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      shadow: "shadow-green-100/50",
    },
    {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      shadow: "shadow-emerald-100/50",
    },
    {
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-200",
      shadow: "shadow-teal-100/50",
    },
    {
      bg: "bg-lime-50",
      text: "text-lime-800",
      border: "border-lime-200",
      shadow: "shadow-lime-100/50",
    },
    {
      bg: "bg-cyan-50",
      text: "text-cyan-800",
      border: "border-cyan-200",
      shadow: "shadow-cyan-100/50",
    },
    {
      bg: "bg-green-100",
      text: "text-green-900",
      border: "border-green-300",
      shadow: "shadow-green-200/50",
    },
    {
      bg: "bg-emerald-100",
      text: "text-emerald-900",
      border: "border-emerald-300",
      shadow: "shadow-emerald-200/50",
    },
    {
      bg: "bg-teal-100",
      text: "text-teal-900",
      border: "border-teal-300",
      shadow: "shadow-teal-200/50",
    },
  ],
  paper: [
    {
      bg: "bg-amber-50",
      text: "text-amber-900",
      border: "border-amber-200",
      shadow: "shadow-amber-100/50",
    },
    {
      bg: "bg-orange-50",
      text: "text-orange-900",
      border: "border-orange-200",
      shadow: "shadow-orange-100/50",
    },
    {
      bg: "bg-yellow-50",
      text: "text-yellow-900",
      border: "border-yellow-200",
      shadow: "shadow-yellow-100/50",
    },
    {
      bg: "bg-stone-50",
      text: "text-stone-900",
      border: "border-stone-200",
      shadow: "shadow-stone-100/50",
    },
    {
      bg: "bg-neutral-50",
      text: "text-neutral-900",
      border: "border-neutral-200",
      shadow: "shadow-neutral-100/50",
    },
    {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-300",
      shadow: "shadow-amber-200/50",
    },
    {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
      shadow: "shadow-orange-200/50",
    },
    {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
      shadow: "shadow-yellow-200/50",
    },
  ],
  starry: [
    {
      bg: "bg-purple-900/50",
      text: "text-purple-200",
      border: "border-purple-600",
      shadow: "shadow-purple-900/30",
    },
    {
      bg: "bg-indigo-900/50",
      text: "text-indigo-200",
      border: "border-indigo-600",
      shadow: "shadow-indigo-900/30",
    },
    {
      bg: "bg-violet-900/50",
      text: "text-violet-200",
      border: "border-violet-600",
      shadow: "shadow-violet-900/30",
    },
    {
      bg: "bg-fuchsia-900/50",
      text: "text-fuchsia-200",
      border: "border-fuchsia-600",
      shadow: "shadow-fuchsia-900/30",
    },
    {
      bg: "bg-pink-900/50",
      text: "text-pink-200",
      border: "border-pink-600",
      shadow: "shadow-pink-900/30",
    },
    {
      bg: "bg-purple-800/50",
      text: "text-purple-100",
      border: "border-purple-500",
      shadow: "shadow-purple-800/30",
    },
    {
      bg: "bg-indigo-800/50",
      text: "text-indigo-100",
      border: "border-indigo-500",
      shadow: "shadow-indigo-800/30",
    },
    {
      bg: "bg-violet-800/50",
      text: "text-violet-100",
      border: "border-violet-500",
      shadow: "shadow-violet-800/30",
    },
  ],
}

// 根据字符串生成颜色索引
export const getTagColorIndex = (text: string): number => {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 转换为32位整数
  }
  return Math.abs(hash) % 8
}

// 根据主题获取标签颜色配置
export const getTagColorsForTheme = (themeName: string) => {
  return (
    tagColorPalettes[themeName as keyof typeof tagColorPalettes] ||
    tagColorPalettes.light
  )
}
