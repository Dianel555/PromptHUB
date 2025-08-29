/**
 * 优化的标签主题配色系统
 * 确保在各种主题（特别是深色模式）下都能清晰可见且美观
 */

export interface TagColorScheme {
  background: string
  backgroundHover: string
  text: string
  textHover: string
  border: string
  borderHover: string
  shadow: string
  gradient?: string
}

export interface ThemeTagConfig {
  light: TagColorScheme
  dark: TagColorScheme
  paper: TagColorScheme
  eyecare: TagColorScheme
}

// 标签维度颜色映射
export const tagDimensionColors = {
  genre: {
    light: {
      background: "bg-blue-50 hover:bg-blue-100",
      backgroundHover: "hover:bg-blue-100",
      text: "text-blue-700 hover:text-blue-800",
      textHover: "hover:text-blue-800",
      border: "border-blue-200 hover:border-blue-300",
      borderHover: "hover:border-blue-300",
      shadow: "shadow-blue-100/50",
      gradient: "bg-gradient-to-r from-blue-500/10 to-blue-600/10"
    },
    dark: {
      background: "bg-blue-900/30 hover:bg-blue-900/50",
      backgroundHover: "hover:bg-blue-900/50",
      text: "text-blue-300 hover:text-blue-200",
      textHover: "hover:text-blue-200",
      border: "border-blue-700/50 hover:border-blue-600/70",
      borderHover: "hover:border-blue-600/70",
      shadow: "shadow-blue-900/30",
      gradient: "bg-gradient-to-r from-blue-400/20 to-blue-500/20"
    },
    paper: {
      background: "bg-amber-50 hover:bg-amber-100",
      backgroundHover: "hover:bg-amber-100",
      text: "text-amber-800 hover:text-amber-900",
      textHover: "hover:text-amber-900",
      border: "border-amber-200 hover:border-amber-300",
      borderHover: "hover:border-amber-300",
      shadow: "shadow-amber-100/50",
      gradient: "bg-gradient-to-r from-amber-500/10 to-orange-500/10"
    },
    eyecare: {
      background: "bg-green-50 hover:bg-green-100",
      backgroundHover: "hover:bg-green-100",
      text: "text-green-700 hover:text-green-800",
      textHover: "hover:text-green-800",
      border: "border-green-200 hover:border-green-300",
      borderHover: "hover:border-green-300",
      shadow: "shadow-green-100/50",
      gradient: "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
    }
  },
  style: {
    light: {
      background: "bg-purple-50 hover:bg-purple-100",
      backgroundHover: "hover:bg-purple-100",
      text: "text-purple-700 hover:text-purple-800",
      textHover: "hover:text-purple-800",
      border: "border-purple-200 hover:border-purple-300",
      borderHover: "hover:border-purple-300",
      shadow: "shadow-purple-100/50",
      gradient: "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
    },
    dark: {
      background: "bg-purple-900/30 hover:bg-purple-900/50",
      backgroundHover: "hover:bg-purple-900/50",
      text: "text-purple-300 hover:text-purple-200",
      textHover: "hover:text-purple-200",
      border: "border-purple-700/50 hover:border-purple-600/70",
      borderHover: "hover:border-purple-600/70",
      shadow: "shadow-purple-900/30",
      gradient: "bg-gradient-to-r from-purple-400/20 to-pink-400/20"
    },
    paper: {
      background: "bg-rose-50 hover:bg-rose-100",
      backgroundHover: "hover:bg-rose-100",
      text: "text-rose-800 hover:text-rose-900",
      textHover: "hover:text-rose-900",
      border: "border-rose-200 hover:border-rose-300",
      borderHover: "hover:border-rose-300",
      shadow: "shadow-rose-100/50",
      gradient: "bg-gradient-to-r from-rose-500/10 to-pink-500/10"
    },
    eyecare: {
      background: "bg-teal-50 hover:bg-teal-100",
      backgroundHover: "hover:bg-teal-100",
      text: "text-teal-700 hover:text-teal-800",
      textHover: "hover:text-teal-800",
      border: "border-teal-200 hover:border-teal-300",
      borderHover: "hover:border-teal-300",
      shadow: "shadow-teal-100/50",
      gradient: "bg-gradient-to-r from-teal-500/10 to-cyan-500/10"
    }
  },
  mood: {
    light: {
      background: "bg-orange-50 hover:bg-orange-100",
      backgroundHover: "hover:bg-orange-100",
      text: "text-orange-700 hover:text-orange-800",
      textHover: "hover:text-orange-800",
      border: "border-orange-200 hover:border-orange-300",
      borderHover: "hover:border-orange-300",
      shadow: "shadow-orange-100/50",
      gradient: "bg-gradient-to-r from-orange-500/10 to-red-500/10"
    },
    dark: {
      background: "bg-orange-900/30 hover:bg-orange-900/50",
      backgroundHover: "hover:bg-orange-900/50",
      text: "text-orange-300 hover:text-orange-200",
      textHover: "hover:text-orange-200",
      border: "border-orange-700/50 hover:border-orange-600/70",
      borderHover: "hover:border-orange-600/70",
      shadow: "shadow-orange-900/30",
      gradient: "bg-gradient-to-r from-orange-400/20 to-red-400/20"
    },
    paper: {
      background: "bg-yellow-50 hover:bg-yellow-100",
      backgroundHover: "hover:bg-yellow-100",
      text: "text-yellow-800 hover:text-yellow-900",
      textHover: "hover:text-yellow-900",
      border: "border-yellow-200 hover:border-yellow-300",
      borderHover: "hover:border-yellow-300",
      shadow: "shadow-yellow-100/50",
      gradient: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
    },
    eyecare: {
      background: "bg-emerald-50 hover:bg-emerald-100",
      backgroundHover: "hover:bg-emerald-100",
      text: "text-emerald-700 hover:text-emerald-800",
      textHover: "hover:text-emerald-800",
      border: "border-emerald-200 hover:border-emerald-300",
      borderHover: "hover:border-emerald-300",
      shadow: "shadow-emerald-100/50",
      gradient: "bg-gradient-to-r from-emerald-500/10 to-green-500/10"
    }
  },
  scene: {
    light: {
      background: "bg-cyan-50 hover:bg-cyan-100",
      backgroundHover: "hover:bg-cyan-100",
      text: "text-cyan-700 hover:text-cyan-800",
      textHover: "hover:text-cyan-800",
      border: "border-cyan-200 hover:border-cyan-300",
      borderHover: "hover:border-cyan-300",
      shadow: "shadow-cyan-100/50",
      gradient: "bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
    },
    dark: {
      background: "bg-cyan-900/30 hover:bg-cyan-900/50",
      backgroundHover: "hover:bg-cyan-900/50",
      text: "text-cyan-300 hover:text-cyan-200",
      textHover: "hover:text-cyan-200",
      border: "border-cyan-700/50 hover:border-cyan-600/70",
      borderHover: "hover:border-cyan-600/70",
      shadow: "shadow-cyan-900/30",
      gradient: "bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
    },
    paper: {
      background: "bg-sky-50 hover:bg-sky-100",
      backgroundHover: "hover:bg-sky-100",
      text: "text-sky-800 hover:text-sky-900",
      textHover: "hover:text-sky-900",
      border: "border-sky-200 hover:border-sky-300",
      borderHover: "hover:border-sky-300",
      shadow: "shadow-sky-100/50",
      gradient: "bg-gradient-to-r from-sky-500/10 to-blue-500/10"
    },
    eyecare: {
      background: "bg-slate-50 hover:bg-slate-100",
      backgroundHover: "hover:bg-slate-100",
      text: "text-slate-700 hover:text-slate-800",
      textHover: "hover:text-slate-800",
      border: "border-slate-200 hover:border-slate-300",
      borderHover: "hover:border-slate-300",
      shadow: "shadow-slate-100/50",
      gradient: "bg-gradient-to-r from-slate-500/10 to-gray-500/10"
    }
  },
  default: {
    light: {
      background: "bg-gray-50 hover:bg-gray-100",
      backgroundHover: "hover:bg-gray-100",
      text: "text-gray-700 hover:text-gray-800",
      textHover: "hover:text-gray-800",
      border: "border-gray-200 hover:border-gray-300",
      borderHover: "hover:border-gray-300",
      shadow: "shadow-gray-100/50",
      gradient: "bg-gradient-to-r from-gray-500/10 to-slate-500/10"
    },
    dark: {
      background: "bg-gray-800/50 hover:bg-gray-800/70",
      backgroundHover: "hover:bg-gray-800/70",
      text: "text-gray-300 hover:text-gray-200",
      textHover: "hover:text-gray-200",
      border: "border-gray-600/50 hover:border-gray-500/70",
      borderHover: "hover:border-gray-500/70",
      shadow: "shadow-gray-900/30",
      gradient: "bg-gradient-to-r from-gray-400/20 to-slate-400/20"
    },
    paper: {
      background: "bg-stone-50 hover:bg-stone-100",
      backgroundHover: "hover:bg-stone-100",
      text: "text-stone-700 hover:text-stone-800",
      textHover: "hover:text-stone-800",
      border: "border-stone-200 hover:border-stone-300",
      borderHover: "hover:border-stone-300",
      shadow: "shadow-stone-100/50",
      gradient: "bg-gradient-to-r from-stone-500/10 to-gray-500/10"
    },
    eyecare: {
      background: "bg-neutral-50 hover:bg-neutral-100",
      backgroundHover: "hover:bg-neutral-100",
      text: "text-neutral-700 hover:text-neutral-800",
      textHover: "hover:text-neutral-800",
      border: "border-neutral-200 hover:border-neutral-300",
      borderHover: "hover:border-neutral-300",
      shadow: "shadow-neutral-100/50",
      gradient: "bg-gradient-to-r from-neutral-500/10 to-gray-500/10"
    }
  }
}

// 特殊标签配色（如精选、热门等）
export const specialTagColors = {
  featured: {
    light: {
      background: "bg-gradient-to-r from-purple-500 to-pink-500",
      backgroundHover: "hover:from-purple-600 hover:to-pink-600",
      text: "text-white",
      textHover: "hover:text-white",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-purple-500/25",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    dark: {
      background: "bg-gradient-to-r from-purple-400 to-pink-400",
      backgroundHover: "hover:from-purple-300 hover:to-pink-300",
      text: "text-gray-900",
      textHover: "hover:text-gray-900",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-purple-400/25",
      gradient: "bg-gradient-to-r from-purple-400 to-pink-400"
    },
    paper: {
      background: "bg-gradient-to-r from-amber-500 to-orange-500",
      backgroundHover: "hover:from-amber-600 hover:to-orange-600",
      text: "text-white",
      textHover: "hover:text-white",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-amber-500/25",
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500"
    },
    eyecare: {
      background: "bg-gradient-to-r from-green-500 to-emerald-500",
      backgroundHover: "hover:from-green-600 hover:to-emerald-600",
      text: "text-white",
      textHover: "hover:text-white",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-green-500/25",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500"
    }
  },
  hot: {
    light: {
      background: "bg-gradient-to-r from-red-500 to-orange-500",
      backgroundHover: "hover:from-red-600 hover:to-orange-600",
      text: "text-white",
      textHover: "hover:text-white",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-red-500/25",
      gradient: "bg-gradient-to-r from-red-500 to-orange-500"
    },
    dark: {
      background: "bg-gradient-to-r from-red-400 to-orange-400",
      backgroundHover: "hover:from-red-300 hover:to-orange-300",
      text: "text-gray-900",
      textHover: "hover:text-gray-900",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-red-400/25",
      gradient: "bg-gradient-to-r from-red-400 to-orange-400"
    },
    paper: {
      background: "bg-gradient-to-r from-red-600 to-rose-600",
      backgroundHover: "hover:from-red-700 hover:to-rose-700",
      text: "text-white",
      textHover: "hover:text-white",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-red-600/25",
      gradient: "bg-gradient-to-r from-red-600 to-rose-600"
    },
    eyecare: {
      background: "bg-gradient-to-r from-orange-500 to-yellow-500",
      backgroundHover: "hover:from-orange-600 hover:to-yellow-600",
      text: "text-gray-900",
      textHover: "hover:text-gray-900",
      border: "border-transparent",
      borderHover: "hover:border-transparent",
      shadow: "shadow-orange-500/25",
      gradient: "bg-gradient-to-r from-orange-500 to-yellow-500"
    }
  }
}

// 获取标签配色方案
export function getTagColorScheme(
  dimension: string = 'default',
  theme: string = 'light',
  special?: 'featured' | 'hot'
): TagColorScheme {
  if (special && specialTagColors[special]) {
    return specialTagColors[special][theme as keyof typeof specialTagColors.featured] || specialTagColors[special].light
  }
  
  const dimensionColors = tagDimensionColors[dimension as keyof typeof tagDimensionColors] || tagDimensionColors.default
  return dimensionColors[theme as keyof typeof dimensionColors] || dimensionColors.light
}

// 生成标签类名
export function generateTagClasses(
  dimension: string = 'default',
  theme: string = 'light',
  size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
  variant: 'solid' | 'outline' | 'ghost' | 'gradient' = 'solid',
  special?: 'featured' | 'hot'
): string {
  const colorScheme = getTagColorScheme(dimension, theme, special)
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const baseClasses = `
    inline-flex items-center rounded-full font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizeClasses[size]}
  `.trim().replace(/\s+/g, ' ')
  
  let variantClasses = ''
  
  switch (variant) {
    case 'solid':
      if (special) {
        variantClasses = `${colorScheme.background} ${colorScheme.backgroundHover} ${colorScheme.text} ${colorScheme.textHover} ${colorScheme.shadow}`
      } else {
        variantClasses = `${colorScheme.background} ${colorScheme.text} border ${colorScheme.border} ${colorScheme.borderHover} ${colorScheme.shadow}`
      }
      break
    case 'outline':
      variantClasses = `bg-transparent ${colorScheme.text} border-2 ${colorScheme.border} ${colorScheme.borderHover} hover:${colorScheme.background.replace('bg-', 'bg-').replace(' hover:bg-', '')}`
      break
    case 'ghost':
      variantClasses = `bg-transparent ${colorScheme.text} ${colorScheme.backgroundHover} border-transparent`
      break
    case 'gradient':
      variantClasses = `${colorScheme.gradient || colorScheme.background} ${colorScheme.text} border-transparent ${colorScheme.shadow}`
      break
  }
  
  return `${baseClasses} ${variantClasses}`.trim().replace(/\s+/g, ' ')
}

// 检查对比度是否足够
export function hasGoodContrast(backgroundColor: string, textColor: string): boolean {
  // 简化的对比度检查，实际项目中可以使用更精确的算法
  const darkBackgrounds = ['gray-800', 'gray-900', 'slate-800', 'slate-900']
  const lightTexts = ['white', 'gray-100', 'gray-200']
  
  const isDarkBg = darkBackgrounds.some(color => backgroundColor.includes(color))
  const isLightText = lightTexts.some(color => textColor.includes(color))
  
  return (isDarkBg && isLightText) || (!isDarkBg && !isLightText)
}

// 自动选择最佳文本颜色
export function getOptimalTextColor(backgroundColor: string, theme: string): string {
  const isDarkTheme = theme === 'dark'
  const isLightBg = backgroundColor.includes('50') || backgroundColor.includes('100')
  
  if (isDarkTheme) {
    return isLightBg ? 'text-gray-900' : 'text-gray-100'
  } else {
    return isLightBg ? 'text-gray-700' : 'text-white'
  }
}