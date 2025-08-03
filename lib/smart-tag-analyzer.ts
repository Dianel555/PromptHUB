import { generateSmartTags, TagCategory, getAllTagCategories } from './tag-system'
import type { SmartTag } from './tag-system'

export interface ContentAnalysis {
  content: string
  suggestedTags: SmartTag[]
  confidence: number
  analysis: {
    genre: string[]
    mood: string[]
    scene: string[]
    style: string[]
  }
  keywords: string[]
}

export interface TagSuggestion {
  tag: SmartTag
  reason: string
  confidence: number
}

export class SmartTagAnalyzer {
  private static readonly CONFIDENCE_THRESHOLD = 0.3
  private static readonly MAX_SUGGESTIONS = 8

  /**
   * 分析内容并生成智能标签建议
   */
  static analyzeContent(content: string): ContentAnalysis {
    if (!content || content.trim().length === 0) {
      return {
        content,
        suggestedTags: [],
        confidence: 0,
        analysis: { genre: [], mood: [], scene: [], style: [] },
        keywords: []
      }
    }

    // 生成智能标签
    const suggestedTags = generateSmartTags(content, this.MAX_SUGGESTIONS)
    
    // 计算整体置信度
    const avgConfidence = suggestedTags.length > 0 
      ? suggestedTags.reduce((sum, tag) => sum + tag.confidence, 0) / suggestedTags.length
      : 0

    // 按维度分组分析结果
    const analysis = this.groupTagsByDimension(suggestedTags)
    
    // 提取关键词
    const keywords = this.extractKeywords(content)

    return {
      content,
      suggestedTags: suggestedTags.filter(tag => tag.confidence >= this.CONFIDENCE_THRESHOLD),
      confidence: avgConfidence,
      analysis,
      keywords
    }
  }

  /**
   * 获取标签建议及其原因
   */
  static getTagSuggestions(content: string): TagSuggestion[] {
    const analysis = this.analyzeContent(content)
    
    return analysis.suggestedTags.map(tag => ({
      tag,
      reason: this.generateTagReason(tag, content),
      confidence: tag.confidence
    }))
  }

  /**
   * 按维度分组标签
   */
  private static groupTagsByDimension(tags: SmartTag[]) {
    const analysis = {
      genre: [] as string[],
      mood: [] as string[],
      scene: [] as string[],
      style: [] as string[]
    }

    tags.forEach(tag => {
      switch (tag.dimension) {
        case 'genre':
          analysis.genre.push(tag.text)
          break
        case 'mood':
          analysis.mood.push(tag.text)
          break
        case 'scene':
          analysis.scene.push(tag.text)
          break
        case 'style':
          analysis.style.push(tag.text)
          break
      }
    })

    return analysis
  }

  /**
   * 生成标签推荐原因
   */
  private static generateTagReason(tag: SmartTag, content: string): string {
    const category = getAllTagCategories().find(c => c.id === tag.category)
    if (!category) return '基于内容分析推荐'

    const matchedKeywords = category.keywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    )

    if (matchedKeywords.length > 0) {
      return `检测到相关关键词：${matchedKeywords.slice(0, 3).join('、')}`
    }

    return `基于${tag.dimension === 'genre' ? '体裁' : 
                tag.dimension === 'mood' ? '情绪' :
                tag.dimension === 'scene' ? '场景' : '风格'}特征分析推荐`
  }

  /**
   * 提取内容关键词
   */
  private static extractKeywords(content: string): string[] {
    // 简单的关键词提取逻辑
    const words = content
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1)

    // 统计词频
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // 返回高频词汇
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  /**
   * 验证标签相关性
   */
  static validateTagRelevance(content: string, tag: SmartTag): number {
    const category = getAllTagCategories().find(c => c.id === tag.category)
    if (!category) return 0

    const contentLower = content.toLowerCase()
    let matchCount = 0

    category.keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        matchCount++
      }
    })

    return matchCount / category.keywords.length
  }

  /**
   * 合并手动标签和智能标签
   */
  static mergeManualAndSmartTags(
    smartTags: SmartTag[], 
    manualTags: string[]
  ): SmartTag[] {
    const merged: SmartTag[] = [...smartTags]
    
    manualTags.forEach((tagText, index) => {
      // 检查是否已存在相同标签
      const exists = merged.some(tag => 
        tag.text === tagText || tag.textEn === tagText
      )
      
      if (!exists) {
        merged.push({
          id: `manual-${index}`,
          text: tagText,
          textEn: tagText,
          dimension: 'custom',
          category: 'manual',
          confidence: 1.0,
          isManual: true
        })
      }
    })

    return merged
  }

  /**
   * 根据内容长度调整标签数量
   */
  static adjustTagCountByContentLength(content: string): number {
    const length = content.length
    
    if (length < 100) return 3
    if (length < 300) return 5
    if (length < 600) return 6
    return 8
  }

  /**
   * 获取相似内容的标签建议
   */
  static getSimilarContentTags(
    currentContent: string,
    similarContents: Array<{ content: string; tags: string[] }>
  ): string[] {
    // 简单的相似度计算和标签推荐
    const suggestions = new Set<string>()
    
    similarContents.forEach(({ content, tags }) => {
      const similarity = this.calculateContentSimilarity(currentContent, content)
      if (similarity > 0.3) {
        tags.forEach(tag => suggestions.add(tag))
      }
    })

    return Array.from(suggestions).slice(0, 5)
  }

  /**
   * 计算内容相似度（简单实现）
   */
  private static calculateContentSimilarity(content1: string, content2: string): number {
    const words1 = new Set(content1.toLowerCase().split(/\s+/))
    const words2 = new Set(content2.toLowerCase().split(/\s+/))
    
    const intersection = new Set(Array.from(words1).filter(word => words2.has(word)))
    const union = new Set([...Array.from(words1), ...Array.from(words2)])
    
    return intersection.size / union.size
  }
}

// 导出类型和工具函数
export type { SmartTag, TagSuggestion, ContentAnalysis }
