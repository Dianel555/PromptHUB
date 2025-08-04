// 增强的标签主题系统 - 支持多主题适配和动态效果
export interface TagThemeConfig {
  name: string
  displayName: string
  description: string
  colors: TagColorPalette
  effects: TagEffects
  typography: TagTypography
  spacing: TagSpacing
}

export interface TagColorPalette {
  // 基础颜色
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string

  // 语义颜色
  success: string
  warning: string
  error: string
  info: string

  // 文本颜色
  textPrimary: string
  textSecondary: string
  textMuted: string
  textInverse: string

  // 边框和分割线
  border: string
  divider: string

  // 状态颜色
  hover: string
  active: string
  disabled: string

  // 维度特定颜色
  genre: string
  mood: string
  scene: string
  style: string
  custom: string
}

export interface TagEffects {
  // 阴影效果
  shadow: {
    small: string
    medium: string
    large: string
    colored: string
  }

  // 动画效果
  transition: {
    duration: string
    easing: string
  }

  // 悬停效果
  hover: {
    scale: number
    brightness: number
    blur: string
  }

  // 渐变效果
  gradient: {
    primary: string
    secondary: string
    accent: string
  }

  // 特殊效果
  glow: string
  pulse: boolean
  shimmer: boolean
}

export interface TagTypography {
  fontFamily: string
  fontSize: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  fontWeight: {
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }
  letterSpacing: {
    tight: string
    normal: string
    wide: string
  }
}

export interface TagSpacing {
  padding: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  margin: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    full: string
  }
  borderWidth: {
    thin: string
    normal: string
    thick: string
  }
}

// 默认主题配置
export const defaultTagTheme: TagThemeConfig = {
  name: "default",
  displayName: "默认主题",
  description: "清新简洁的默认标签主题",
  colors: {
    primary: "#3B82F6",
    secondary: "#6B7280",
    accent: "#10B981",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    textInverse: "#FFFFFF",
    border: "#E5E7EB",
    divider: "#F3F4F6",
    hover: "#F3F4F6",
    active: "#E5E7EB",
    disabled: "#F9FAFB",
    genre: "#8B5CF6",
    mood: "#EC4899",
    scene: "#06B6D4",
    style: "#F59E0B",
    custom: "#6B7280",
  },
  effects: {
    shadow: {
      small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      colored: "0 4px 14px 0 rgba(59, 130, 246, 0.15)",
    },
    transition: {
      duration: "150ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    hover: {
      scale: 1.02,
      brightness: 1.05,
      blur: "0px",
    },
    gradient: {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      accent: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    glow: "0 0 20px rgba(59, 130, 246, 0.3)",
    pulse: false,
    shimmer: false,
  },
  typography: {
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
    },
  },
  spacing: {
    padding: {
      xs: "0.25rem 0.5rem",
      sm: "0.375rem 0.75rem",
      md: "0.5rem 1rem",
      lg: "0.75rem 1.25rem",
      xl: "1rem 1.5rem",
    },
    margin: {
      xs: "0.125rem",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
    borderRadius: {
      none: "0px",
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      full: "9999px",
    },
    borderWidth: {
      thin: "1px",
      normal: "2px",
      thick: "3px",
    },
  },
}

// 深色主题配置
export const darkTagTheme: TagThemeConfig = {
  ...defaultTagTheme,
  name: "dark",
  displayName: "深色主题",
  description: "适合夜间使用的深色标签主题",
  colors: {
    ...defaultTagTheme.colors,
    background: "#111827",
    surface: "#1F2937",
    textPrimary: "#F9FAFB",
    textSecondary: "#D1D5DB",
    textMuted: "#9CA3AF",
    border: "#374151",
    divider: "#4B5563",
    hover: "#374151",
    active: "#4B5563",
    disabled: "#1F2937",
  },
  effects: {
    ...defaultTagTheme.effects,
    shadow: {
      small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
      colored: "0 4px 14px 0 rgba(59, 130, 246, 0.3)",
    },
    glow: "0 0 20px rgba(59, 130, 246, 0.5)",
  },
}

// 星空主题配置
export const starryTagTheme: TagThemeConfig = {
  ...defaultTagTheme,
  name: "starry",
  displayName: "星空主题",
  description: "神秘梦幻的星空标签主题",
  colors: {
    ...defaultTagTheme.colors,
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#EC4899",
    background: "#0F0F23",
    surface: "#1A1A3E",
    textPrimary: "#E0E7FF",
    textSecondary: "#C7D2FE",
    textMuted: "#A5B4FC",
    border: "#3730A3",
    divider: "#4338CA",
    hover: "#312E81",
    active: "#3730A3",
  },
  effects: {
    ...defaultTagTheme.effects,
    glow: "0 0 25px rgba(99, 102, 241, 0.6)",
    pulse: true,
    shimmer: true,
    gradient: {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      accent: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  },
}

// 护眼主题配置
export const eyecareTagTheme: TagThemeConfig = {
  ...defaultTagTheme,
  name: "eyecare",
  displayName: "护眼主题",
  description: "温和护眼的标签主题",
  colors: {
    ...defaultTagTheme.colors,
    primary: "#059669",
    secondary: "#6B7280",
    accent: "#0891B2",
    background: "#F0FDF4",
    surface: "#ECFDF5",
    textPrimary: "#064E3B",
    textSecondary: "#065F46",
    textMuted: "#047857",
    border: "#BBF7D0",
    divider: "#D1FAE5",
    hover: "#D1FAE5",
    active: "#BBF7D0",
  },
  effects: {
    ...defaultTagTheme.effects,
    shadow: {
      small: "0 1px 2px 0 rgba(5, 150, 105, 0.1)",
      medium: "0 4px 6px -1px rgba(5, 150, 105, 0.15)",
      large: "0 10px 15px -3px rgba(5, 150, 105, 0.2)",
      colored: "0 4px 14px 0 rgba(5, 150, 105, 0.25)",
    },
    glow: "0 0 15px rgba(5, 150, 105, 0.2)",
  },
}

// 纸质主题配置
export const paperTagTheme: TagThemeConfig = {
  ...defaultTagTheme,
  name: "paper",
  displayName: "纸质主题",
  description: "温暖复古的纸质标签主题",
  colors: {
    ...defaultTagTheme.colors,
    primary: "#92400E",
    secondary: "#78716C",
    accent: "#B45309",
    background: "#FEF7ED",
    surface: "#FED7AA",
    textPrimary: "#451A03",
    textSecondary: "#92400E",
    textMuted: "#A16207",
    border: "#FED7AA",
    divider: "#FDBA74",
    hover: "#FDBA74",
    active: "#FB923C",
  },
  effects: {
    ...defaultTagTheme.effects,
    shadow: {
      small: "0 1px 2px 0 rgba(146, 64, 14, 0.1)",
      medium: "0 4px 6px -1px rgba(146, 64, 14, 0.15)",
      large: "0 10px 15px -3px rgba(146, 64, 14, 0.2)",
      colored: "0 4px 14px 0 rgba(146, 64, 14, 0.25)",
    },
    glow: "0 0 15px rgba(146, 64, 14, 0.2)",
  },
}

// 所有主题配置
export const tagThemes: Record<string, TagThemeConfig> = {
  default: defaultTagTheme,
  dark: darkTagTheme,
  starry: starryTagTheme,
  eyecare: eyecareTagTheme,
  paper: paperTagTheme,
}

// 获取主题配置
export function getTagTheme(themeName: string): TagThemeConfig {
  return tagThemes[themeName] || defaultTagTheme
}

// 根据维度获取颜色
export function getDimensionColor(
  dimension: string,
  theme: TagThemeConfig
): string {
  const dimensionColors = {
    genre: theme.colors.genre,
    mood: theme.colors.mood,
    scene: theme.colors.scene,
    style: theme.colors.style,
    custom: theme.colors.custom,
  }
  return (
    dimensionColors[dimension as keyof typeof dimensionColors] ||
    theme.colors.primary
  )
}

// 生成标签CSS类名
export function generateTagClasses(
  dimension: string,
  theme: TagThemeConfig,
  size: "xs" | "sm" | "md" | "lg" | "xl" = "md",
  variant: "solid" | "outline" | "ghost" | "gradient" = "solid"
): string {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "transition-all",
    "duration-150",
    "ease-in-out",
    "cursor-pointer",
    "select-none",
  ]

  // 尺寸类名
  const sizeClasses = {
    xs: ["text-xs", "px-2", "py-1", "rounded"],
    sm: ["text-sm", "px-2.5", "py-1.5", "rounded-md"],
    md: ["text-sm", "px-3", "py-2", "rounded-md"],
    lg: ["text-base", "px-4", "py-2.5", "rounded-lg"],
    xl: ["text-lg", "px-5", "py-3", "rounded-lg"],
  }

  // 变体类名
  const variantClasses = {
    solid: ["text-white", "shadow-sm", "hover:shadow-md"],
    outline: ["border-2", "bg-transparent", "hover:bg-opacity-10"],
    ghost: ["bg-transparent", "hover:bg-opacity-10"],
    gradient: [
      "text-white",
      "shadow-sm",
      "hover:shadow-md",
      "bg-gradient-to-r",
    ],
  }

  return [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
  ].join(" ")
}

// 生成标签样式对象
export function generateTagStyles(
  dimension: string,
  theme: TagThemeConfig,
  variant: "solid" | "outline" | "ghost" | "gradient" = "solid",
  customColor?: string
): React.CSSProperties {
  const dimensionColor = customColor || getDimensionColor(dimension, theme)

  const baseStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    transition: `all ${theme.effects.transition.duration} ${theme.effects.transition.easing}`,
    borderRadius: theme.spacing.borderRadius.md,
  }

  switch (variant) {
    case "solid":
      return {
        ...baseStyles,
        backgroundColor: dimensionColor,
        color: theme.colors.textInverse,
        boxShadow: theme.effects.shadow.small,
      }

    case "outline":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        color: dimensionColor,
        border: `${theme.spacing.borderWidth.normal} solid ${dimensionColor}`,
      }

    case "ghost":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        color: dimensionColor,
      }

    case "gradient":
      return {
        ...baseStyles,
        background: theme.effects.gradient.primary,
        color: theme.colors.textInverse,
        boxShadow: theme.effects.shadow.colored,
      }

    default:
      return baseStyles
  }
}

// 主题切换动画
export function createThemeTransition(duration: number = 300): string {
  return `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
}

// 响应式标签尺寸
export function getResponsiveTagSize(
  screenSize: "mobile" | "tablet" | "desktop"
): "xs" | "sm" | "md" | "lg" | "xl" {
  const sizeMap = {
    mobile: "xs" as const,
    tablet: "sm" as const,
    desktop: "md" as const,
  }
  return sizeMap[screenSize]
}
