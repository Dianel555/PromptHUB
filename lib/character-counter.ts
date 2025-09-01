/**
 * 优化的字符统计工具
 * 排除空行和连续空格，提供更准确的字符统计
 */

export interface CharacterStats {
  totalChars: number
  effectiveChars: number
  lines: number
  words: number
}

/**
 * 计算有效字符数（排除空行和连续空格）
 * @param text 要统计的文本
 * @returns 字符统计结果
 */
export function countEffectiveCharacters(text: string): CharacterStats {
  if (!text) {
    return {
      totalChars: 0,
      effectiveChars: 0,
      lines: 0,
      words: 0
    }
  }

  // 原始字符数
  const totalChars = text.length

  // 处理文本：移除空行和压缩连续空格
  const processedText = text
    .split('\n')
    .map(line => line.trim()) // 移除每行首尾空白
    .filter(line => line.length > 0) // 移除空行
    .map(line => line.replace(/\s+/g, ' ')) // 将连续空格压缩为单个空格
    .join('\n')

  // 有效字符数
  const effectiveChars = processedText.length

  // 行数（非空行）
  const lines = processedText ? processedText.split('\n').length : 0

  // 单词数（按空格分割）
  const words = processedText
    .split(/\s+/)
    .filter(word => word.length > 0).length

  return {
    totalChars,
    effectiveChars,
    lines,
    words
  }
}

/**
 * 格式化字符统计显示
 * @param stats 字符统计结果
 * @param showDetailed 是否显示详细信息
 * @returns 格式化的统计字符串
 */
export function formatCharacterStats(
  stats: CharacterStats, 
  showDetailed: boolean = false
): string {
  if (showDetailed) {
    return `${stats.effectiveChars} 字符 (${stats.totalChars} 总计) • ${stats.words} 词 • ${stats.lines} 行`
  }
  return `${stats.effectiveChars}/${stats.totalChars} 字符`
}

/**
 * 实时字符统计Hook（用于React组件）
 * @param text 要统计的文本
 * @param maxLength 最大长度限制
 * @returns 统计结果和格式化显示
 */
export function useCharacterCounter(text: string, maxLength?: number) {
  const stats = countEffectiveCharacters(text)
  
  const isOverLimit = maxLength ? stats.effectiveChars > maxLength : false
  const progress = maxLength ? (stats.effectiveChars / maxLength) * 100 : 0
  
  const displayText = maxLength 
    ? `${stats.effectiveChars}/${maxLength}`
    : `${stats.effectiveChars} 字符`
    
  return {
    stats,
    isOverLimit,
    progress,
    displayText,
    formatted: formatCharacterStats(stats)
  }
}