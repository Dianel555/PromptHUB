// 简单的本地存储管理系统
export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  author: {
    id: string
    name: string
    avatar?: string
  }
  likes: number
  comments: number
  views: number
  createdAt: string
  updatedAt: string
  isPublic: boolean
}

const STORAGE_KEY = 'user_prompts'
const STATS_KEY = 'user_stats'

// 获取当前用户ID（模拟）
export const getCurrentUserId = () => 'current_user'

// 获取用户的所有提示词
export const getUserPrompts = (): Prompt[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('获取提示词失败:', error)
    return []
  }
}

// 保存提示词
export const savePrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments' | 'views'>): Prompt => {
  const prompts = getUserPrompts()
  const now = new Date().toISOString()
  
  const newPrompt: Prompt = {
    ...promptData,
    id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    likes: 0,
    comments: 0,
    views: 0
  }
  
  prompts.unshift(newPrompt) // 添加到开头
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
    updateUserStats()
    return newPrompt
  } catch (error) {
    console.error('保存提示词失败:', error)
    throw new Error('保存失败')
  }
}

// 更新提示词
export const updatePrompt = (id: string, updates: Partial<Prompt>): Prompt | null => {
  const prompts = getUserPrompts()
  const index = prompts.findIndex(p => p.id === id)
  
  if (index === -1) return null
  
  const updatedPrompt = {
    ...prompts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  prompts[index] = updatedPrompt
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
    return updatedPrompt
  } catch (error) {
    console.error('更新提示词失败:', error)
    throw new Error('更新失败')
  }
}

// 删除提示词
export const deletePrompt = (id: string): boolean => {
  const prompts = getUserPrompts()
  const filteredPrompts = prompts.filter(p => p.id !== id)
  
  if (filteredPrompts.length === prompts.length) return false
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPrompts))
    updateUserStats()
    return true
  } catch (error) {
    console.error('删除提示词失败:', error)
    throw new Error('删除失败')
  }
}

// 根据ID获取提示词
export const getPromptById = (id: string): Prompt | null => {
  const prompts = getUserPrompts()
  return prompts.find(p => p.id === id) || null
}

// 获取用户统计数据
export const getUserStats = () => {
  if (typeof window === 'undefined') return { totalPrompts: 0, totalLikes: 0, totalViews: 0 }
  
  try {
    const stored = localStorage.getItem(STATS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
  
  // 如果没有存储的统计数据，计算当前数据
  const prompts = getUserPrompts()
  const stats = {
    totalPrompts: prompts.length,
    totalLikes: prompts.reduce((sum, p) => sum + p.likes, 0),
    totalViews: prompts.reduce((sum, p) => sum + p.views, 0)
  }
  
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('保存统计数据失败:', error)
  }
  
  return stats
}

// 更新用户统计数据
export const updateUserStats = () => {
  const prompts = getUserPrompts()
  const stats = {
    totalPrompts: prompts.length,
    totalLikes: prompts.reduce((sum, p) => sum + p.likes, 0),
    totalViews: prompts.reduce((sum, p) => sum + p.views, 0)
  }
  
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('更新统计数据失败:', error)
  }
}

// 增加浏览量
export const incrementViews = (id: string) => {
  const prompts = getUserPrompts()
  const prompt = prompts.find(p => p.id === id)
  
  if (prompt) {
    prompt.views += 1
    prompt.updatedAt = new Date().toISOString()
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
      updateUserStats()
    } catch (error) {
      console.error('更新浏览量失败:', error)
    }
  }
}

// 切换点赞状态
export const toggleLike = (id: string, isLiked: boolean): number => {
  const prompts = getUserPrompts()
  const prompt = prompts.find(p => p.id === id)
  
  if (prompt) {
    prompt.likes += isLiked ? 1 : -1
    prompt.updatedAt = new Date().toISOString()
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
      updateUserStats()
      return prompt.likes
    } catch (error) {
      console.error('更新点赞失败:', error)
    }
  }
  
  return 0
}