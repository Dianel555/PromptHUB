// 标签颜色系统 - 为不同类型的标签提供视觉差异化
export interface TagColorScheme {
  background: string
  backgroundHover: string
  text: string
  textHover: string
  border: string
  borderHover: string
  accent: string
}

// 预定义的标签颜色方案
export const tagColorSchemes: Record<string, TagColorScheme> = {
  // 图像相关 - 紫色系
  image: {
    background: "bg-purple-50 dark:bg-purple-950/20",
    backgroundHover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    textHover: "hover:text-purple-800 dark:hover:text-purple-200",
    border: "border-purple-200 dark:border-purple-800",
    borderHover: "hover:border-purple-300 dark:hover:border-purple-700",
    accent: "bg-purple-500"
  },
  
  // 艺术相关 - 粉色系
  art: {
    background: "bg-pink-50 dark:bg-pink-950/20",
    backgroundHover: "hover:bg-pink-100 dark:hover:bg-pink-900/30",
    text: "text-pink-700 dark:text-pink-300",
    textHover: "hover:text-pink-800 dark:hover:text-pink-200",
    border: "border-pink-200 dark:border-pink-800",
    borderHover: "hover:border-pink-300 dark:hover:border-pink-700",
    accent: "bg-pink-500"
  },
  
  // 精选内容 - 青色系
  featured: {
    background: "bg-cyan-50 dark:bg-cyan-950/20",
    backgroundHover: "hover:bg-cyan-100 dark:hover:bg-cyan-900/30",
    text: "text-cyan-700 dark:text-cyan-300",
    textHover: "hover:text-cyan-800 dark:hover:text-cyan-200",
    border: "border-cyan-200 dark:border-cyan-800",
    borderHover: "hover:border-cyan-300 dark:hover:border-cyan-700",
    accent: "bg-cyan-500"
  },
  
  // 技术相关 - 蓝色系
  tech: {
    background: "bg-blue-50 dark:bg-blue-950/20",
    backgroundHover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    textHover: "hover:text-blue-800 dark:hover:text-blue-200",
    border: "border-blue-200 dark:border-blue-800",
    borderHover: "hover:border-blue-300 dark:hover:border-blue-700",
    accent: "bg-blue-500"
  },
  
  // 写作相关 - 绿色系
  writing: {
    background: "bg-green-50 dark:bg-green-950/20",
    backgroundHover: "hover:bg-green-100 dark:hover:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    textHover: "hover:text-green-800 dark:hover:text-green-200",
    border: "border-green-200 dark:border-green-800",
    borderHover: "hover:border-green-300 dark:hover:border-green-700",
    accent: "bg-green-500"
  },
  
  // 商业相关 - 橙色系
  business: {
    background: "bg-orange-50 dark:bg-orange-950/20",
    backgroundHover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    textHover: "hover:text-orange-800 dark:hover:text-orange-200",
    border: "border-orange-200 dark:border-orange-800",
    borderHover: "hover:border-orange-300 dark:hover:border-orange-700",
    accent: "bg-orange-500"
  },
  
  // 教育相关 - 靛蓝色系
  education: {
    background: "bg-indigo-50 dark:bg-indigo-950/20",
    backgroundHover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
    text: "text-indigo-700 dark:text-indigo-300",
    textHover: "hover:text-indigo-800 dark:hover:text-indigo-200",
    border: "border-indigo-200 dark:border-indigo-800",
    borderHover: "hover:border-indigo-300 dark:hover:border-indigo-700",
    accent: "bg-indigo-500"
  },
  
  // 娱乐相关 - 玫瑰色系
  entertainment: {
    background: "bg-rose-50 dark:bg-rose-950/20",
    backgroundHover: "hover:bg-rose-100 dark:hover:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-300",
    textHover: "hover:text-rose-800 dark:hover:text-rose-200",
    border: "border-rose-200 dark:border-rose-800",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    accent: "bg-rose-500"
  },
  
  // 默认 - 灰色系
  default: {
    background: "bg-gray-50 dark:bg-gray-950/20",
    backgroundHover: "hover:bg-gray-100 dark:hover:bg-gray-900/30",
    text: "text-gray-700 dark:text-gray-300",
    textHover: "hover:text-gray-800 dark:hover:text-gray-200",
    border: "border-gray-200 dark:border-gray-800",
    borderHover: "hover:border-gray-300 dark:hover:border-gray-700",
    accent: "bg-gray-500"
  }
}

// 标签类型映射
export const tagTypeMapping: Record<string, string> = {
  "图像": "image",
  "艺术": "art",
  "精选": "featured",
  "技术": "tech",
  "写作": "writing",
  "商业": "business",
  "教育": "education",
  "娱乐": "entertainment",
  "AI": "tech",
  "设计": "art",
  "编程": "tech",
  "营销": "business",
  "学习": "education",
  "游戏": "entertainment"
}

// 获取标签颜色方案
export function getTagColorScheme(tag: string): TagColorScheme {
  const normalizedTag = tag.toLowerCase().trim()
  const tagType = tagTypeMapping[tag] || tagTypeMapping[normalizedTag] || "default"
  return tagColorSchemes[tagType] || tagColorSchemes.default
}

// 生成标签的完整CSS类名
export function getTagClasses(tag: string, size: "sm" | "md" | "lg" = "md"): string {
  const scheme = getTagColorScheme(tag)
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  return [
    "inline-flex items-center rounded-full font-medium transition-all duration-200",
    "border cursor-pointer select-none",
    sizeClasses[size],
    scheme.background,
    scheme.backgroundHover,
    scheme.text,
    scheme.textHover,
    scheme.border,
    scheme.borderHover
  ].join(" ")
}

// 为卡片生成基于标签的渐变背景
export function getCardGradientClasses(tags: string[]): string {
  if (tags.length === 0) return "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
  
  const primaryTag = tags[0]
  const scheme = getTagColorScheme(primaryTag)
  
  // 根据主要标签生成渐变背景
  const gradientMap: Record<string, string> = {
    image: "bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950/20 dark:via-gray-900 dark:to-purple-900/30",
    art: "bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-pink-950/20 dark:via-gray-900 dark:to-pink-900/30",
    featured: "bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-cyan-950/20 dark:via-gray-900 dark:to-cyan-900/30",
    tech: "bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950/20 dark:via-gray-900 dark:to-blue-900/30",
    writing: "bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-950/20 dark:via-gray-900 dark:to-green-900/30",
    business: "bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-orange-950/20 dark:via-gray-900 dark:to-orange-900/30",
    education: "bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-indigo-950/20 dark:via-gray-900 dark:to-indigo-900/30",
    entertainment: "bg-gradient-to-br from-rose-50 via-white to-rose-100 dark:from-rose-950/20 dark:via-gray-900 dark:to-rose-900/30",
    default: "bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950/20 dark:via-gray-900 dark:to-gray-800"
  }
  
  const tagType = tagTypeMapping[primaryTag] || "default"
  return gradientMap[tagType] || gradientMap.default
}