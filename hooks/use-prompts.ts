import { useState, useEffect } from 'react'
import { unifiedDataManager } from '@/lib/unified-data-manager'

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

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPrompts = async () => {
    try {
      setLoading(true)
      const data = unifiedDataManager.getPrompts()
      setPrompts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (promptId: string) => {
    try {
      const result = await unifiedDataManager.toggleLike(promptId)
      await loadPrompts() // 刷新数据
      return result.isLiked
    } catch (err) {
      console.error('Toggle like failed:', err)
      return false
    }
  }

  const toggleFavorite = async (promptId: string) => {
    try {
      const result = await unifiedDataManager.toggleFavorite(promptId)
      await loadPrompts() // 刷新数据
      return result
    } catch (err) {
      console.error('Toggle favorite failed:', err)
      return false
    }
  }

  const incrementView = async (promptId: string) => {
    try {
      await unifiedDataManager.incrementView(promptId)
      await loadPrompts() // 刷新数据
    } catch (err) {
      console.error('Increment view failed:', err)
    }
  }

  useEffect(() => {
    loadPrompts()
  }, [])

  return {
    prompts,
    loading,
    error,
    refresh: loadPrompts,
    toggleLike,
    toggleFavorite,
    incrementView
  }
}

// 用户交互Hook
export function useUserInteraction(promptId: string) {
  const [interaction, setInteraction] = useState<{
    isLiked: boolean
    isFavorited: boolean
    viewCount: number
  } | null>(null)

  useEffect(() => {
    if (promptId) {
      const userInteraction = unifiedDataManager.getUserInteraction(promptId)
      setInteraction(userInteraction)
    }
  }, [promptId])

  return { interaction }
}