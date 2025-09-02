"use client"

import { useState, useEffect, useCallback } from 'react'
import { unifiedDataManager, UnifiedStats, UserInteraction, DataEvent } from '@/lib/unified-data-manager'
import { Prompt } from '@/lib/prompt-storage'

// 提示词数据Hook
export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshPrompts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await unifiedDataManager.getPrompts()
      setPrompts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取提示词失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshPrompts()

    // 监听数据更新事件
    const handleUpdate = () => {
      refreshPrompts()
    }

    unifiedDataManager.on('prompt-updated', handleUpdate)
    unifiedDataManager.on('like-toggled', handleUpdate)

    return () => {
      unifiedDataManager.off('prompt-updated', handleUpdate)
      unifiedDataManager.off('like-toggled', handleUpdate)
    }
  }, [refreshPrompts])

  return { prompts, loading, error, refresh: refreshPrompts }
}

// 单个提示词Hook
export function usePrompt(id: string) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshPrompt = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await unifiedDataManager.getPromptById(id)
      setPrompt(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取提示词详情失败')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    refreshPrompt()

    // 监听特定提示词的更新
    const handleUpdate = (data: { id: string }) => {
      if (data.id === id) {
        refreshPrompt()
      }
    }

    unifiedDataManager.on('prompt-updated', handleUpdate)
    unifiedDataManager.on('like-toggled', handleUpdate)

    return () => {
      unifiedDataManager.off('prompt-updated', handleUpdate)
      unifiedDataManager.off('like-toggled', handleUpdate)
    }
  }, [id, refreshPrompt])

  return { prompt, loading, error, refresh: refreshPrompt }
}

// 统计数据Hook
export function useUnifiedStats() {
  const [stats, setStats] = useState<UnifiedStats>({
    totalPrompts: 0,
    totalLikes: 0,
    totalViews: 0,
    totalFavorites: 0,
    source: 'local'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await unifiedDataManager.getStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取统计数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshStats()

    // 监听统计数据更新事件
    const handleUpdate = () => {
      refreshStats()
    }

    unifiedDataManager.on('prompt-updated', handleUpdate)
    unifiedDataManager.on('like-toggled', handleUpdate)
    unifiedDataManager.on('favorite-toggled', handleUpdate)
    unifiedDataManager.on('stats-updated', handleUpdate)

    return () => {
      unifiedDataManager.off('prompt-updated', handleUpdate)
      unifiedDataManager.off('like-toggled', handleUpdate)
      unifiedDataManager.off('favorite-toggled', handleUpdate)
      unifiedDataManager.off('stats-updated', handleUpdate)
    }
  }, [refreshStats])

  return { stats, loading, error, refresh: refreshStats }
}

// 用户交互Hook
export function useUserInteraction(promptId: string) {
  const [interaction, setInteraction] = useState<UserInteraction>({
    promptId,
    isLiked: false,
    isFavorited: false,
    viewCount: 0
  })
  const [loading, setLoading] = useState(false)

  // 刷新交互数据
  const refreshInteraction = useCallback(() => {
    if (!promptId) return
    const data = unifiedDataManager.getUserInteraction(promptId)
    setInteraction(data)
  }, [promptId])

  // 切换点赞
  const toggleLike = useCallback(async () => {
    if (loading) return

    try {
      setLoading(true)
      const result = await unifiedDataManager.toggleLike(promptId)
      setInteraction(prev => ({
        ...prev,
        isLiked: result.isLiked
      }))
      return result
    } catch (error) {
      console.error('点赞操作失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [promptId, loading])

  // 切换收藏
  const toggleFavorite = useCallback(async () => {
    if (loading) return

    try {
      setLoading(true)
      const isFavorited = await unifiedDataManager.toggleFavorite(promptId)
      setInteraction(prev => ({
        ...prev,
        isFavorited
      }))
      return isFavorited
    } catch (error) {
      console.error('收藏操作失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [promptId, loading])

  // 增加浏览量
  const incrementView = useCallback(async () => {
    try {
      const newViewCount = await unifiedDataManager.incrementView(promptId)
      setInteraction(prev => ({
        ...prev,
        viewCount: newViewCount
      }))
      return newViewCount
    } catch (error) {
      console.error('增加浏览量失败:', error)
      return 0
    }
  }, [promptId])

  useEffect(() => {
    refreshInteraction()

    // 监听交互事件
    const handleLikeToggle = (data: { promptId: string; isLiked: boolean }) => {
      if (data.promptId === promptId) {
        setInteraction(prev => ({
          ...prev,
          isLiked: data.isLiked
        }))
      }
    }

    const handleFavoriteToggle = (data: { promptId: string; isFavorited: boolean }) => {
      if (data.promptId === promptId) {
        setInteraction(prev => ({
          ...prev,
          isFavorited: data.isFavorited
        }))
      }
    }

    unifiedDataManager.on('like-toggled', handleLikeToggle)
    unifiedDataManager.on('favorite-toggled', handleFavoriteToggle)

    return () => {
      unifiedDataManager.off('like-toggled', handleLikeToggle)
      unifiedDataManager.off('favorite-toggled', handleFavoriteToggle)
    }
  }, [promptId, refreshInteraction])

  return {
    interaction,
    loading,
    toggleLike,
    toggleFavorite,
    incrementView,
    refresh: refreshInteraction
  }
}

// 数据完整性Hook
export function useDataIntegrity() {
  const [isValid, setIsValid] = useState(true)
  const [issues, setIssues] = useState<string[]>([])
  const [checking, setChecking] = useState(false)

  const checkIntegrity = useCallback(async () => {
    try {
      setChecking(true)
      const result = await unifiedDataManager.validateDataIntegrity()
      setIsValid(result.isValid)
      setIssues(result.issues)
      return result
    } catch (error) {
      console.error('数据完整性检查失败:', error)
      setIsValid(false)
      setIssues(['数据完整性检查失败'])
      return { isValid: false, issues: ['数据完整性检查失败'] }
    } finally {
      setChecking(false)
    }
  }, [])

  const repairData = useCallback(async () => {
    try {
      const success = await unifiedDataManager.repairDataInconsistency()
      if (success) {
        await checkIntegrity() // 重新检查
      }
      return success
    } catch (error) {
      console.error('数据修复失败:', error)
      return false
    }
  }, [checkIntegrity])

  useEffect(() => {
    checkIntegrity()
  }, [checkIntegrity])

  return {
    isValid,
    issues,
    checking,
    checkIntegrity,
    repairData
  }
}