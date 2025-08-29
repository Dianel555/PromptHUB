/**
 * 增强的标签主题系统
 * 解决深色主题下标签可见性问题
 */

export interface TagThemeConfig {
  light: {
    background: string
    text: string
    border: string
    hover: {
      background: string
      text: string
    }
  }
  dark: {
    background: string
    text: string
    border: string
    hover: {
      background: string
      text: string
    }
  }
}

// 标签类型定义
export type TagType =
  | "content" // 内容标签
  | "community" // 社区标签
  | "category" // 分类标签
  | "skill" // 技能标签
  | "difficulty" // 难度标签
  | "featured" // 精选标签
  | "hot" // 热门标签
  | "new" // 新标签
  | "default" // 默认标签

/**
 * 获取标签的主题样式
 */
export function getTagThemeClasses(
  type: TagType = "default",
  variant: "solid" | "outline" | "ghost" = "solid"
): string {
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  // 根据标签类型返回对应的样式类
  switch (type) {
    case "content":
      return `${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-800/40`
    case "community":
      return `${baseClasses} bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-800/40`
    case "category":
      return `${baseClasses} bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:hover:bg-purple-800/40`
    case "skill":
      return `${baseClasses} bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-200 dark:hover:bg-orange-800/40`
    case "difficulty":
      return `${baseClasses} bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-800/40`
    case "featured":
      return `${baseClasses} bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:from-purple-400 dark:to-pink-400 dark:text-gray-900`
    case "hot":
      return `${baseClasses} bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 dark:from-red-400 dark:to-orange-400 dark:text-gray-900`
    case "new":
      return `${baseClasses} bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-800/40`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500`
  }
}

/**
 * 获取标签的可访问性属性
 */
export function getTagAccessibilityProps(type: TagType) {
  return {
    role: "button",
    tabIndex: 0,
    "aria-label": `${type} 标签`,
    "data-tag-type": type,
  }
}
