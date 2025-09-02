"use client"

import { Prompt } from './prompt-storage'

// 事件类型定义
export type DataEvent = 'prompt-updated' | 'stats-updated' | 'like-toggled' | 'favorite-toggled'

// 稳定ID生成函数
function generateStableId(title: string, content: string): string {
  const combinedContent = (title + content).trim()
  if (!combinedContent) {
    return `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
  }
  
  // 使用简单哈希算法生成稳定ID
  let hash = 0
  for (let i = 0; i < combinedContent.length; i++) {
    const char = combinedContent.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  
  // 转换为正数并生成12位字符串
  const hashStr = Math.abs(hash).toString(36).padStart(8, '0').substring(0, 8)
  return `prompt_${hashStr}`
}

// 数据迁移函数 - 更保守的迁移策略
function migrateToStableIds(): boolean {
  try {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]')
    
    // 如果没有数据，跳过迁移
    if (prompts.length === 0) {
      return true
    }
    
    // 检查是否需要迁移
    const needsMigration = prompts.some((prompt: any) => 
      !prompt.id || 
      (prompt.id.includes('_') && prompt.id.length > 20) // 长时间戳ID需要迁移
    )
    
    if (!needsMigration) {
      console.log('数据已是稳定格式，跳过迁移')
      return true
    }
    
    let hasChanges = false
    const migratedPrompts = prompts.map((prompt: any, index: number) => {
      // 如果已经是合理的ID格式，保持不变
      if (prompt.id && prompt.id.length <= 20 && !prompt.id.includes('_', 8)) {
        return prompt
      }
      
      // 为需要迁移的数据生成新ID
      let newId
      if (prompt.title && prompt.content) {
        newId = generateStableId(prompt.title, prompt.content)
      } else {
        // 如果缺少内容，使用索引生成ID
        newId = `prompt_${(index + 1).toString().padStart(3, '0')}`
      }
      
      hasChanges = true
      
      return {
        ...prompt,
        id: newId,
        originalId: prompt.id, // 保留原ID用于兼容
        migratedAt: new Date().toISOString()
      }
    })
    
    if (hasChanges) {
      localStorage.setItem('prompts', JSON.stringify(migratedPrompts))
      console.log('数据迁移完成，已更新', migratedPrompts.filter((_: any, i: number) => migratedPrompts[i].id !== prompts[i].id).length, '个提示词的ID')
    }
    
    return true
  } catch (error) {
    console.error('数据迁移失败:', error)
    return false
  }
}

// 统计数据接口
export interface UnifiedStats {
  totalPrompts: number
  totalLikes: number
  totalViews: number
  totalFavorites: number
  source: 'local' | 'api' | 'hybrid'
}

// 用户交互数据接口
export interface UserInteraction {
  promptId: string
  isLiked: boolean
  isFavorited: boolean
  viewCount: number
}

// 事件监听器类型
type EventListener = (data: any) => void

class UnifiedDataManager {
  private eventListeners: Map<DataEvent, EventListener[]> = new Map()
  private cache: Map<string, any> = new Map()
  private readonly STORAGE_KEYS = {
    PROMPTS: 'prompts',
    USER_STATS: 'userStats',
    INTERACTIONS: 'userInteractions',
    FAVORITES: 'userFavorites'
  }

  constructor() {
    // 初始化事件监听器映射
    Object.values(['prompt-updated', 'stats-updated', 'like-toggled', 'favorite-toggled'] as DataEvent[]).forEach(event => {
      this.eventListeners.set(event, [])
    })
    
    // 执行数据迁移（仅在浏览器环境中）
    if (typeof window !== 'undefined') {
      this.initializeData()
    }
  }

  /**
   * 初始化数据，包括迁移旧格式ID
   */
  private async initializeData(): Promise<void> {
    try {
      // 执行数据迁移
      migrateToStableIds()
      
      // 验证数据完整性
      const validation = await this.validateDataIntegrity()
      if (!validation.isValid) {
        console.warn('数据完整性检查发现问题:', validation.issues)
        await this.repairDataInconsistency()
      }
    } catch (error) {
      console.error('数据初始化失败:', error)
    }
  }

  // ==================== 事件系统 ====================
  
  /**
   * 注册事件监听器
   */
  on(event: DataEvent, listener: EventListener): void {
    const listeners = this.eventListeners.get(event) || []
    listeners.push(listener)
    this.eventListeners.set(event, listeners)
  }

  /**
   * 移除事件监听器
   */
  off(event: DataEvent, listener: EventListener): void {
    const listeners = this.eventListeners.get(event) || []
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * 触发事件
   */
  private emit(event: DataEvent, data: any): void {
    const listeners = this.eventListeners.get(event) || []
    listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        console.error(`事件监听器执行失败 [${event}]:`, error)
      }
    })
  }

  // ==================== 数据获取 ====================

  /**
   * 获取所有提示词
   */
  async getPrompts(): Promise<Prompt[]> {
    try {
      const cached = this.cache.get('prompts')
      if (cached && Date.now() - cached.timestamp < 5000) { // 5秒缓存
        return cached.data
      }

      const prompts = this.getPromptsFromStorage()
      this.cache.set('prompts', { data: prompts, timestamp: Date.now() })
      return prompts
    } catch (error) {
      console.error('获取提示词失败:', error)
      return []
    }
  }

  /**
   * 根据ID获取单个提示词
   */
  async getPromptById(id: string): Promise<Prompt | null> {
    try {
      const prompts = await this.getPrompts()
      return prompts.find(p => p.id === id) || null
    } catch (error) {
      console.error('获取提示词详情失败:', error)
      return null
    }
  }

  /**
   * 创建新提示词
   */
  async createPrompt(promptData: Omit<Prompt, 'id'>): Promise<Prompt> {
    try {
      // 生成稳定ID
      const id = generateStableId(promptData.title, promptData.content)
      
      const newPrompt: Prompt = {
        ...promptData,
        id,
        updatedAt: promptData.createdAt || new Date().toISOString()
      }

      // 获取现有提示词
      const prompts = await this.getPrompts()
      
      // 检查是否已存在相同ID的提示词
      const existingIndex = prompts.findIndex(p => p.id === id)
      if (existingIndex !== -1) {
        // 如果存在，更新现有提示词
        prompts[existingIndex] = newPrompt
        console.log('更新现有提示词:', id)
      } else {
        // 如果不存在，添加新提示词到开头
        prompts.unshift(newPrompt)
        console.log('创建新提示词:', id)
      }

      // 保存到localStorage
      this.savePromptsToStorage(prompts)
      
      // 清除缓存
      this.cache.delete('prompts')
      this.cache.delete('stats')
      
      // 触发事件
      this.emit('prompt-updated', { id, prompt: newPrompt })
      
      return newPrompt
    } catch (error) {
      console.error('创建提示词失败:', error)
      throw error
    }
  }

  /**
   * 获取统计数据
   */
  async getStats(): Promise<UnifiedStats> {
    try {
      const cached = this.cache.get('stats')
      if (cached && Date.now() - cached.timestamp < 3000) { // 3秒缓存
        return cached.data
      }

      const prompts = await this.getPrompts()
      const interactions = this.getUserInteractions()
      const favorites = this.getFavorites()

      const stats: UnifiedStats = {
        totalPrompts: prompts.length,
        totalLikes: prompts.reduce((sum, p) => sum + (p.likes || 0), 0),
        totalViews: prompts.reduce((sum, p) => sum + (p.views || 0), 0),
        totalFavorites: favorites.length,
        source: 'local'
      }

      this.cache.set('stats', { data: stats, timestamp: Date.now() })
      return stats
    } catch (error) {
      console.error('获取统计数据失败:', error)
      return {
        totalPrompts: 0,
        totalLikes: 0,
        totalViews: 0,
        totalFavorites: 0,
        source: 'local'
      }
    }
  }

  /**
   * 获取用户交互数据
   */
  getUserInteraction(promptId: string): UserInteraction {
    const interactions = this.getUserInteractions()
    const favorites = this.getFavorites()
    
    return {
      promptId,
      isLiked: interactions[promptId]?.isLiked || false,
      isFavorited: favorites.includes(promptId),
      viewCount: interactions[promptId]?.viewCount || 0
    }
  }

  // ==================== 数据更新 ====================

  /**
   * 更新提示词
   */
  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<void> {
    try {
      const prompts = await this.getPrompts()
      const index = prompts.findIndex(p => p.id === id)
      
      if (index === -1) {
        throw new Error(`提示词不存在: ${id}`)
      }

      prompts[index] = { ...prompts[index], ...updates, updatedAt: new Date().toISOString() }
      this.savePromptsToStorage(prompts)
      
      // 清除缓存并触发事件
      this.cache.delete('prompts')
      this.cache.delete('stats')
      this.emit('prompt-updated', { id, updates })
    } catch (error) {
      console.error('更新提示词失败:', error)
      throw error
    }
  }

  /**
   * 切换点赞状态
   */
  async toggleLike(promptId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    try {
      const interactions = this.getUserInteractions()
      const currentInteraction = interactions[promptId] || { isLiked: false, viewCount: 0 }
      const wasLiked = currentInteraction.isLiked
      const newLikedState = !wasLiked

      // 更新用户交互数据
      interactions[promptId] = {
        ...currentInteraction,
        isLiked: newLikedState
      }
      this.saveUserInteractions(interactions)

      // 获取提示词数据并更新点赞数
      const prompts = await this.getPrompts()
      const promptIndex = prompts.findIndex(p => p.id === promptId)
      
      if (promptIndex !== -1) {
        const prompt = prompts[promptIndex]
        const currentLikes = prompt.likes || 0
        
        // 修复点赞数计算逻辑：基于之前的状态来决定增减
        let newLikeCount
        if (newLikedState && !wasLiked) {
          // 用户点赞：只有之前没有点赞时才+1
          newLikeCount = currentLikes + 1
        } else if (!newLikedState && wasLiked) {
          // 用户取消点赞：只有之前有点赞时才-1
          newLikeCount = Math.max(0, currentLikes - 1)
        } else {
          // 状态没有实际改变，保持原数量
          newLikeCount = currentLikes
        }
        
        // 直接更新prompts数组中的数据，避免重复调用updatePrompt
        prompts[promptIndex] = {
          ...prompt,
          likes: newLikeCount,
          updatedAt: new Date().toISOString()
        }
        
        // 保存到localStorage
        this.savePromptsToStorage(prompts)
        
        // 清除缓存
        this.cache.delete('prompts')
        this.cache.delete('stats')
        
        this.emit('like-toggled', { promptId, isLiked: newLikedState, likeCount: newLikeCount })
        return { isLiked: newLikedState, likeCount: newLikeCount }
      }

      return { isLiked: newLikedState, likeCount: 0 }
    } catch (error) {
      console.error('切换点赞状态失败:', error)
      throw error
    }
  }

  /**
   * 切换收藏状态
   */
  async toggleFavorite(promptId: string): Promise<boolean> {
    try {
      const favorites = this.getFavorites()
      const isFavorited = favorites.includes(promptId)
      
      if (isFavorited) {
        // 移除收藏
        const index = favorites.indexOf(promptId)
        favorites.splice(index, 1)
      } else {
        // 添加收藏
        favorites.push(promptId)
      }

      this.saveFavorites(favorites)
      this.cache.delete('stats') // 清除统计缓存
      
      this.emit('favorite-toggled', { promptId, isFavorited: !isFavorited })
      return !isFavorited
    } catch (error) {
      console.error('切换收藏状态失败:', error)
      throw error
    }
  }

  /**
   * 增加浏览量
   */
  async incrementView(promptId: string): Promise<number> {
    try {
      const interactions = this.getUserInteractions()
      const currentInteraction = interactions[promptId] || { isLiked: false, viewCount: 0 }
      
      // 更新用户交互数据
      interactions[promptId] = {
        ...currentInteraction,
        viewCount: currentInteraction.viewCount + 1
      }
      this.saveUserInteractions(interactions)

      // 更新提示词的浏览量
      const prompts = await this.getPrompts()
      const prompt = prompts.find(p => p.id === promptId)
      if (prompt) {
        const newViewCount = (prompt.views || 0) + 1
        await this.updatePrompt(promptId, { views: newViewCount })
        return newViewCount
      }

      return 1
    } catch (error) {
      console.error('增加浏览量失败:', error)
      return 0
    }
  }

  // ==================== 存储操作 ====================

  private getPromptsFromStorage(): Prompt[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PROMPTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('读取提示词数据失败:', error)
      return []
    }
  }

  private savePromptsToStorage(prompts: Prompt[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PROMPTS, JSON.stringify(prompts))
    } catch (error) {
      console.error('保存提示词数据失败:', error)
    }
  }

  private getUserInteractions(): Record<string, { isLiked: boolean; viewCount: number }> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.INTERACTIONS)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('读取用户交互数据失败:', error)
      return {}
    }
  }

  private saveUserInteractions(interactions: Record<string, { isLiked: boolean; viewCount: number }>): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions))
    } catch (error) {
      console.error('保存用户交互数据失败:', error)
    }
  }

  private getFavorites(): string[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.FAVORITES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('读取收藏数据失败:', error)
      return []
    }
  }

  private saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
    } catch (error) {
      console.error('保存收藏数据失败:', error)
    }
  }

  // ==================== 数据同步和修复 ====================

  /**
   * 数据完整性检查
   */
  async validateDataIntegrity(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = []

    try {
      // 检查提示词数据
      const prompts = await this.getPrompts()
      prompts.forEach((prompt, index) => {
        if (!prompt.id) issues.push(`提示词 ${index} 缺少ID`)
        if (!prompt.title) issues.push(`提示词 ${prompt.id} 缺少标题`)
        if (typeof prompt.likes !== 'number') issues.push(`提示词 ${prompt.id} 点赞数格式错误`)
        if (typeof prompt.views !== 'number') issues.push(`提示词 ${prompt.id} 浏览量格式错误`)
      })

      // 检查用户交互数据
      const interactions = this.getUserInteractions()
      Object.entries(interactions).forEach(([promptId, interaction]) => {
        if (typeof interaction.isLiked !== 'boolean') {
          issues.push(`交互数据 ${promptId} 点赞状态格式错误`)
        }
        if (typeof interaction.viewCount !== 'number') {
          issues.push(`交互数据 ${promptId} 浏览次数格式错误`)
        }
      })

      return { isValid: issues.length === 0, issues }
    } catch (error) {
      console.error('数据完整性检查失败:', error)
      return { isValid: false, issues: ['数据完整性检查失败'] }
    }
  }

  /**
   * 修复数据不一致问题
   */
  async repairDataInconsistency(): Promise<boolean> {
    try {
      const prompts = await this.getPrompts()
      let hasChanges = false

      // 修复提示词数据
      prompts.forEach(prompt => {
        if (typeof prompt.likes !== 'number') {
          prompt.likes = 0
          hasChanges = true
        }
        if (typeof prompt.views !== 'number') {
          prompt.views = 0
          hasChanges = true
        }
        if (!prompt.createdAt) {
          prompt.createdAt = new Date().toISOString()
          hasChanges = true
        }
      })

      if (hasChanges) {
        this.savePromptsToStorage(prompts)
        this.cache.clear()
        this.emit('stats-updated', await this.getStats())
      }

      return true
    } catch (error) {
      console.error('数据修复失败:', error)
      return false
    }
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// 创建全局单例实例
export const unifiedDataManager = new UnifiedDataManager()

// 导出类型和实例
export { UnifiedDataManager }
export default unifiedDataManager