// 标签系统统一配置文件
// 所有参数都采用系统默认值，无需用户手动调整

export interface TagSystemConfig {
  // 标签数量限制
  maxTags: number
  maxTagLength: number

  // 智能分析配置
  analysisDelay: number
  confidenceThreshold: number
  maxSuggestions: number

  // 标签云配置
  minFontSize: number
  maxFontSize: number
  tagSpacing: number

  // 主题配置
  primaryColor: string
  secondaryColor: string
  accentColor: string

  // 性能优化配置
  debounceDelay: number
  maxAnalysisLength: number
}

// 统一的默认配置
export const DEFAULT_TAG_CONFIG: TagSystemConfig = {
  // 标签数量和长度限制
  maxTags: 8, // 最多8个标签，平衡功能性和简洁性
  maxTagLength: 20, // 单个标签最多20字符

  // 智能分析参数
  analysisDelay: 300, // 300ms延迟，避免频繁分析
  confidenceThreshold: 0.6, // 60%置信度阈值，确保推荐质量
  maxSuggestions: 6, // 最多显示6个建议，避免选择困难

  // 标签云显示参数
  minFontSize: 12, // 最小字体大小12px
  maxFontSize: 24, // 最大字体大小24px
  tagSpacing: 8, // 标签间距8px

  // 主题色彩配置
  primaryColor: "#3B82F6", // 蓝色主色调
  secondaryColor: "#6B7280", // 灰色辅助色
  accentColor: "#F59E0B", // 琥珀色强调色

  // 性能优化参数
  debounceDelay: 200, // 输入防抖延迟200ms
  maxAnalysisLength: 5000, // 最大分析文本长度5000字符
}

// 标签维度权重配置（系统自动使用）
export const DIMENSION_WEIGHTS = {
  genre: 1.0, // 体裁权重最高
  mood: 0.9, // 情绪权重次之
  scene: 0.8, // 场景权重中等
  style: 0.7, // 风格权重较低
  audience: 0.6, // 受众权重最低
}

// 标签质量评估标准
export const QUALITY_THRESHOLDS = {
  excellent: 0.9, // 优秀标签阈值
  good: 0.7, // 良好标签阈值
  acceptable: 0.5, // 可接受标签阈值
  poor: 0.3, // 较差标签阈值
}

// 内容分析规则配置
export const ANALYSIS_RULES = {
  // 关键词提取规则
  keywordExtraction: {
    minLength: 2, // 最小关键词长度
    maxLength: 10, // 最大关键词长度
    stopWords: [
      "的",
      "了",
      "在",
      "是",
      "有",
      "和",
      "与",
      "或",
      "但",
      "而",
      "因为",
      "所以",
    ],
  },

  // 情感分析规则
  sentimentAnalysis: {
    positiveWords: ["美好", "快乐", "幸福", "成功", "胜利", "希望", "光明"],
    negativeWords: ["悲伤", "痛苦", "失败", "绝望", "黑暗", "恐惧", "焦虑"],
    neutralThreshold: 0.1, // 中性情感阈值
  },

  // 主题识别规则
  themeDetection: {
    minOccurrence: 2, // 主题词最少出现次数
    contextWindow: 50, // 上下文窗口大小
    relevanceThreshold: 0.4, // 相关性阈值
  },
}

// 获取配置的辅助函数
export function getTagConfig(): TagSystemConfig {
  return { ...DEFAULT_TAG_CONFIG }
}

// 获取维度权重
export function getDimensionWeight(dimension: string): number {
  return DIMENSION_WEIGHTS[dimension as keyof typeof DIMENSION_WEIGHTS] || 0.5
}

// 评估标签质量
export function evaluateTagQuality(
  confidence: number
): "excellent" | "good" | "acceptable" | "poor" {
  if (confidence >= QUALITY_THRESHOLDS.excellent) return "excellent"
  if (confidence >= QUALITY_THRESHOLDS.good) return "good"
  if (confidence >= QUALITY_THRESHOLDS.acceptable) return "acceptable"
  return "poor"
}

// 验证标签有效性
export function validateTag(tag: string): { valid: boolean; reason?: string } {
  const config = getTagConfig()

  if (!tag || tag.trim().length === 0) {
    return { valid: false, reason: "标签不能为空" }
  }

  if (tag.length > config.maxTagLength) {
    return {
      valid: false,
      reason: `标签长度不能超过${config.maxTagLength}个字符`,
    }
  }

  if (tag.includes(" ") && tag.trim().split(" ").length > 3) {
    return { valid: false, reason: "标签不应包含过多空格" }
  }

  // 检查特殊字符
  const invalidChars = /[<>{}[\]\\\/]/
  if (invalidChars.test(tag)) {
    return { valid: false, reason: "标签包含无效字符" }
  }

  return { valid: true }
}

// 标签去重和规范化
export function normalizeTag(tag: string): string {
  return tag
    .trim() // 去除首尾空格
    .replace(/\s+/g, " ") // 多个空格合并为一个
    .toLowerCase() // 转为小写（可选）
}

// 批量处理标签
export function processTags(tags: string[]): string[] {
  const config = getTagConfig()
  const processedTags: string[] = []

  for (const tag of tags) {
    const normalizedTag = normalizeTag(tag)
    const validation = validateTag(normalizedTag)

    if (validation.valid && !processedTags.includes(normalizedTag)) {
      processedTags.push(normalizedTag)

      // 达到最大数量限制时停止
      if (processedTags.length >= config.maxTags) {
        break
      }
    }
  }

  return processedTags
}
