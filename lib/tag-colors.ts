// 标签颜色系统 - 优化深色模式对比度
export type TagType = 
  | 'tech' 
  | 'business' 
  | 'writing' 
  | 'education' 
  | 'image' 
  | 'research'
  | 'content'
  | 'development'
  | 'academic'
  | 'opensource'
  | 'community'
  | 'default'

// 标签映射 - 将中文标签映射到标签类型
const tagMapping: Record<string, TagType> = {
  // 技术相关
  '代码': 'tech',
  '开发': 'development', 
  '技术': 'tech',
  '编程': 'tech',
  '开源': 'opensource',
  'AI': 'tech',
  '人工智能': 'tech',
  '机器学习': 'tech',
  '深度学习': 'tech',
  
  // 商业相关
  '商业': 'business',
  '营销': 'business',
  '管理': 'business',
  '创业': 'business',
  '社区': 'community',
  
  // 写作相关
  '写作': 'writing',
  '内容': 'content',
  '文案': 'writing',
  '创作': 'writing',
  
  // 教育相关
  '教育': 'education',
  '学习': 'education',
  '学术': 'academic',
  '研究': 'research',
  '科研': 'research',
  
  // 图像相关
  '图像': 'image',
  '设计': 'image',
  '视觉': 'image',
  '艺术': 'image',
}

// 深色模式优化的颜色方案
const colorSchemes = {
  tech: {
    light: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    },
    dark: {
      background: 'bg-blue-500/20',
      text: 'text-blue-200',
      border: 'border-blue-400/40',
      hover: 'hover:bg-blue-500/30'
    }
  },
  
  development: {
    light: {
      background: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      hover: 'hover:bg-emerald-100'
    },
    dark: {
      background: 'bg-emerald-500/20',
      text: 'text-emerald-200',
      border: 'border-emerald-400/40',
      hover: 'hover:bg-emerald-500/30'
    }
  },
  
  business: {
    light: {
      background: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100'
    },
    dark: {
      background: 'bg-purple-500/20',
      text: 'text-purple-200',
      border: 'border-purple-400/40',
      hover: 'hover:bg-purple-500/30'
    }
  },
  
  writing: {
    light: {
      background: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100'
    },
    dark: {
      background: 'bg-orange-500/20',
      text: 'text-orange-200',
      border: 'border-orange-400/40',
      hover: 'hover:bg-orange-500/30'
    }
  },
  
  content: {
    light: {
      background: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      hover: 'hover:bg-amber-100'
    },
    dark: {
      background: 'bg-amber-500/20',
      text: 'text-amber-200',
      border: 'border-amber-400/40',
      hover: 'hover:bg-amber-500/30'
    }
  },
  
  education: {
    light: {
      background: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    },
    dark: {
      background: 'bg-green-500/20',
      text: 'text-green-200',
      border: 'border-green-400/40',
      hover: 'hover:bg-green-500/30'
    }
  },
  
  // 特别优化：学术标签 - 使用高对比度的青色
  academic: {
    light: {
      background: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      hover: 'hover:bg-cyan-100'
    },
    dark: {
      background: 'bg-cyan-400/25',
      text: 'text-cyan-100',
      border: 'border-cyan-300/50',
      hover: 'hover:bg-cyan-400/35'
    }
  },
  
  // 特别优化：研究标签 - 使用高对比度的紫色
  research: {
    light: {
      background: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      hover: 'hover:bg-violet-100'
    },
    dark: {
      background: 'bg-violet-400/25',
      text: 'text-violet-100',
      border: 'border-violet-300/50',
      hover: 'hover:bg-violet-400/35'
    }
  },
  
  // 特别优化：图像标签 - 使用高对比度的粉色
  image: {
    light: {
      background: 'bg-pink-50',
      text: 'text-pink-700',
      border: 'border-pink-200',
      hover: 'hover:bg-pink-100'
    },
    dark: {
      background: 'bg-pink-400/25',
      text: 'text-pink-100',
      border: 'border-pink-300/50',
      hover: 'hover:bg-pink-400/35'
    }
  },
  
  opensource: {
    light: {
      background: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      hover: 'hover:bg-teal-100'
    },
    dark: {
      background: 'bg-teal-500/20',
      text: 'text-teal-200',
      border: 'border-teal-400/40',
      hover: 'hover:bg-teal-500/30'
    }
  },
  
  community: {
    light: {
      background: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      hover: 'hover:bg-indigo-100'
    },
    dark: {
      background: 'bg-indigo-500/20',
      text: 'text-indigo-200',
      border: 'border-indigo-400/40',
      hover: 'hover:bg-indigo-500/30'
    }
  },
  
  default: {
    light: {
      background: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100'
    },
    dark: {
      background: 'bg-gray-500/20',
      text: 'text-gray-200',
      border: 'border-gray-400/40',
      hover: 'hover:bg-gray-500/30'
    }
  }
}

// 获取标签类型
export function getTagType(tag: string): TagType {
  const normalizedTag = tag.trim().toLowerCase()
  
  // 直接匹配
  if (tagMapping[tag]) {
    return tagMapping[tag]
  }
  
  // 模糊匹配
  for (const [key, value] of Object.entries(tagMapping)) {
    if (normalizedTag.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTag)) {
      return value
    }
  }
  
  return 'default'
}

// 获取标签颜色方案 - 支持主题切换
export function getTagColorScheme(tag: string, isDark: boolean = false) {
  const tagType = getTagType(tag)
  const scheme = colorSchemes[tagType]
  
  if (!scheme) {
    return colorSchemes.default[isDark ? 'dark' : 'light']
  }
  
  return scheme[isDark ? 'dark' : 'light']
}

// 获取所有可用的标签类型
export function getAllTagTypes(): TagType[] {
  return Object.keys(colorSchemes) as TagType[]
}

// 获取标签的完整样式类名
export function getTagClasses(tag: string, isDark: boolean = false): string {
  const colors = getTagColorScheme(tag, isDark)
  
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${colors.background} ${colors.text} ${colors.border} ${colors.hover} border`
}

// 预定义的标签颜色映射（用于快速查找）
export const TAG_COLORS = {
  // 中文标签直接映射
  '图像': 'image',
  '学术': 'academic', 
  '研究': 'research',
  '内容': 'content',
  '写作': 'writing',
  '代码': 'tech',
  '开发': 'development',
  '教育': 'education',
  '商业': 'business',
  '开源': 'opensource',
  '社区': 'community',
} as const