// 多维度标签分类体系配置
export interface TagDimension {
  id: string
  name: string
  nameEn: string
  description: string
  color: string
  icon: string
  categories: TagCategory[]
}

export interface TagCategory {
  id: string
  name: string
  nameEn: string
  description: string
  keywords: string[]
  weight: number
}

export interface SmartTag {
  id: string
  text: string
  textEn: string
  dimension: string
  category: string
  confidence: number
  isManual: boolean
}

// 导出SmartTag类型以供其他模块使用
export type { SmartTag as SmartTagType }

// 标签维度定义
export const tagDimensions: TagDimension[] = [
  {
    id: 'genre',
    name: '体裁',
    nameEn: 'Genre',
    description: '内容的文体类型和表现形式',
    color: '#3B82F6',
    icon: 'BookOpen',
    categories: [
      {
        id: 'creative-writing',
        name: '创意写作',
        nameEn: 'Creative Writing',
        description: '小说、诗歌、散文等文学创作',
        keywords: ['小说', '诗歌', '散文', '故事', '创作', 'novel', 'poetry', 'story', '文学'],
        weight: 1.0
      },
      {
        id: 'technical-writing',
        name: '技术写作',
        nameEn: 'Technical Writing',
        description: '技术文档、教程、说明书等',
        keywords: ['技术', '文档', '教程', '说明', 'technical', 'documentation', 'tutorial'],
        weight: 1.0
      },
      {
        id: 'business-writing',
        name: '商务写作',
        nameEn: 'Business Writing',
        description: '商业计划、报告、邮件等',
        keywords: ['商务', '商业', '报告', '计划', 'business', 'report', 'plan', '邮件'],
        weight: 1.0
      },
      {
        id: 'academic-writing',
        name: '学术写作',
        nameEn: 'Academic Writing',
        description: '论文、研究报告、学术文章',
        keywords: ['学术', '论文', '研究', 'academic', 'research', 'paper', '科研'],
        weight: 1.0
      }
    ]
  },
  {
    id: 'mood',
    name: '情绪',
    nameEn: 'Mood',
    description: '内容传达的情感基调和氛围',
    color: '#EF4444',
    icon: 'Heart',
    categories: [
      {
        id: 'positive',
        name: '积极',
        nameEn: 'Positive',
        description: '乐观、振奋、鼓舞人心的内容',
        keywords: ['积极', '乐观', '振奋', '鼓舞', 'positive', 'optimistic', '开心', '快乐'],
        weight: 1.0
      },
      {
        id: 'neutral',
        name: '中性',
        nameEn: 'Neutral',
        description: '客观、平和、不带强烈情感色彩',
        keywords: ['中性', '客观', '平和', 'neutral', 'objective', '理性', '冷静'],
        weight: 1.0
      },
      {
        id: 'serious',
        name: '严肃',
        nameEn: 'Serious',
        description: '正式、庄重、专业的语调',
        keywords: ['严肃', '正式', '庄重', 'serious', 'formal', '专业', '权威'],
        weight: 1.0
      },
      {
        id: 'creative',
        name: '创意',
        nameEn: 'Creative',
        description: '富有想象力、创新性的表达',
        keywords: ['创意', '创新', '想象', 'creative', 'innovative', '艺术', '灵感'],
        weight: 1.0
      }
    ]
  },
  {
    id: 'scene',
    name: '场景',
    nameEn: 'Scene',
    description: '内容适用的具体使用场景',
    color: '#10B981',
    icon: 'MapPin',
    categories: [
      {
        id: 'work',
        name: '工作',
        nameEn: 'Work',
        description: '职场、办公、商务环境',
        keywords: ['工作', '职场', '办公', 'work', 'office', 'business', '会议'],
        weight: 1.0
      },
      {
        id: 'education',
        name: '教育',
        nameEn: 'Education',
        description: '学习、教学、培训场景',
        keywords: ['教育', '学习', '教学', 'education', 'learning', 'teaching', '培训'],
        weight: 1.0
      },
      {
        id: 'personal',
        name: '个人',
        nameEn: 'Personal',
        description: '个人生活、兴趣爱好',
        keywords: ['个人', '生活', '兴趣', 'personal', 'life', 'hobby', '日常'],
        weight: 1.0
      },
      {
        id: 'social',
        name: '社交',
        nameEn: 'Social',
        description: '社交媒体、交流互动',
        keywords: ['社交', '交流', '互动', 'social', 'communication', '媒体', '分享'],
        weight: 1.0
      }
    ]
  },
  {
    id: 'style',
    name: '风格',
    nameEn: 'Style',
    description: '内容的表达风格和语言特色',
    color: '#8B5CF6',
    icon: 'Palette',
    categories: [
      {
        id: 'concise',
        name: '简洁',
        nameEn: 'Concise',
        description: '简明扼要、直接有效',
        keywords: ['简洁', '简明', '直接', 'concise', 'brief', 'direct', '高效'],
        weight: 1.0
      },
      {
        id: 'detailed',
        name: '详细',
        nameEn: 'Detailed',
        description: '详尽全面、深入分析',
        keywords: ['详细', '详尽', '全面', 'detailed', 'comprehensive', '深入', '完整'],
        weight: 1.0
      },
      {
        id: 'conversational',
        name: '对话式',
        nameEn: 'Conversational',
        description: '轻松自然、如同对话',
        keywords: ['对话', '轻松', '自然', 'conversational', 'casual', '友好', '亲切'],
        weight: 1.0
      },
      {
        id: 'professional',
        name: '专业',
        nameEn: 'Professional',
        description: '专业术语、权威表达',
        keywords: ['专业', '权威', '术语', 'professional', 'authoritative', '正式', '规范'],
        weight: 1.0
      }
    ]
  }
]

// 获取所有标签类别
export function getAllTagCategories(): TagCategory[] {
  return tagDimensions.flatMap(dimension => dimension.categories)
}

// 根据关键词匹配标签类别
export function matchTagCategories(content: string): Array<{category: TagCategory, confidence: number}> {
  const results: Array<{category: TagCategory, confidence: number}> = []
  const contentLower = content.toLowerCase()
  
  getAllTagCategories().forEach(category => {
    let matchCount = 0
    let totalKeywords = category.keywords.length
    
    category.keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        matchCount++
      }
    })
    
    if (matchCount > 0) {
      const confidence = (matchCount / totalKeywords) * category.weight
      results.push({ category, confidence })
    }
  })
  
  return results.sort((a, b) => b.confidence - a.confidence)
}

// 生成智能标签
export function generateSmartTags(content: string, maxTags: number = 8): SmartTag[] {
  const matches = matchTagCategories(content)
  const tags: SmartTag[] = []
  
  // 每个维度最多选择2个标签
  const dimensionCounts: Record<string, number> = {}
  
  matches.forEach(match => {
    const dimension = tagDimensions.find(d => 
      d.categories.some(c => c.id === match.category.id)
    )
    
    if (dimension && (dimensionCounts[dimension.id] || 0) < 2 && tags.length < maxTags) {
      dimensionCounts[dimension.id] = (dimensionCounts[dimension.id] || 0) + 1
      
      tags.push({
        id: `${dimension.id}-${match.category.id}`,
        text: match.category.name,
        textEn: match.category.nameEn,
        dimension: dimension.id,
        category: match.category.id,
        confidence: match.confidence,
        isManual: false
      })
    }
  })
  
  return tags
}

// 获取标签的颜色配置
export function getTagColor(dimensionId: string): string {
  const dimension = tagDimensions.find(d => d.id === dimensionId)
  return dimension?.color || '#6B7280'
}

// 获取标签的图标
export function getTagIcon(dimensionId: string): string {
  const dimension = tagDimensions.find(d => d.id === dimensionId)
  return dimension?.icon || 'Tag'
}