"use client"

// 定义Prompt接口
export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  author: {
    name: string
    avatar?: string
    id?: string
  }
  likes: number
  views: number
  createdAt: string
  updatedAt: string
}

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

  /**
   * 通知所有监听器数据已更新
   */
  notifyListeners(): void {
    this.emit('stats-updated', {})
  }

  // ==================== 数据获取 ====================

  /**
   * 获取所有提示词
   */
  getPrompts(): Prompt[] {
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
   * 保存提示词到存储
   */
  savePrompts(prompts: Prompt[]): void {
    this.savePromptsToStorage(prompts)
    this.cache.delete('prompts')
    this.cache.delete('stats')
  }

  /**
   * 根据ID获取单个提示词
   */
  async getPromptById(id: string): Promise<Prompt | null> {
    try {
      const prompts = this.getPrompts()
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
      const prompts = this.getPrompts()
      
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
      this.savePrompts(prompts)
      
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

      const prompts = this.getPrompts()
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
      const prompts = this.getPrompts()
      const index = prompts.findIndex(p => p.id === id)
      
      if (index === -1) {
        throw new Error(`提示词不存在: ${id}`)
      }

      prompts[index] = { ...prompts[index], ...updates, updatedAt: new Date().toISOString() }
      this.savePrompts(prompts)
      
      // 触发事件
      this.emit('prompt-updated', { id, updates })
    } catch (error) {
      console.error('更新提示词失败:', error)
      throw error
    }
  }

  /**
   * 切换点赞状态 - 修复重复计算问题
   */
  async toggleLike(promptId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    try {
      const interactions = this.getUserInteractions()
      const currentInteraction = interactions[promptId] || { isLiked: false, viewCount: 0 }
      
      // 获取当前点赞状态
      const wasLiked = currentInteraction.isLiked
      const newLikedState = !wasLiked

      // 更新用户交互数据
      interactions[promptId] = {
        ...currentInteraction,
        isLiked: newLikedState
      }
      this.saveUserInteractions(interactions)

      // 获取提示词数据并更新点赞数
      const prompts = this.getPrompts()
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
        
        // 更新提示词的点赞数
        prompts[promptIndex] = {
          ...prompt,
          likes: newLikeCount,
          updatedAt: new Date().toISOString()
        }
        
        this.savePrompts(prompts)
        console.log(`点赞状态切换: ${promptId}, 新状态: ${newLikedState}, 点赞数: ${currentLikes} -> ${newLikeCount}`)
        
        this.cache.delete('stats') // 清除统计缓存
        
        // 触发事件通知
        this.emit('like-toggled', { promptId, isLiked: newLikedState })
        this.notifyListeners()
        
        return { isLiked: newLikedState, likeCount: newLikeCount }
      }

      // 如果没找到提示词，返回默认值
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
   * 增加浏览量 - 修复持久化问题
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
      const prompts = this.getPrompts()
      const promptIndex = prompts.findIndex(p => p.id === promptId)
      if (promptIndex !== -1) {
        const prompt = prompts[promptIndex]
        const newViewCount = (prompt.views || 0) + 1
        
        prompts[promptIndex] = {
          ...prompt,
          views: newViewCount,
          updatedAt: new Date().toISOString()
        }
        
        this.savePrompts(prompts)
        console.log(`浏览量增加: ${promptId}, 新浏览量: ${newViewCount}`)
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
      const prompts = this.getPrompts()
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
      const prompts = this.getPrompts()
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
        this.savePrompts(prompts)
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