import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface PromptStats {
  likes: number
  views: number
  isLiked: boolean
  loading: boolean
}

interface UsePromptStatsReturn {
  stats: PromptStats
  toggleLike: () => Promise<boolean>
  incrementView: () => Promise<void>
  refreshStats: () => Promise<void>
}

export function usePromptStats(promptId: string): UsePromptStatsReturn {
  const { data: session } = useSession()
  const [stats, setStats] = useState<PromptStats>({
    likes: 0,
    views: 0,
    isLiked: false,
    loading: true
  })

  // 从localStorage获取浏览量缓存
  const getViewsFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(`prompt_views_${promptId}`)
      return cached ? parseInt(cached) : 0
    } catch {
      return 0
    }
  }, [promptId])

  // 保存浏览量到localStorage
  const saveViewsToCache = useCallback((views: number) => {
    try {
      localStorage.setItem(`prompt_views_${promptId}`, views.toString())
    } catch (error) {
      console.warn('保存浏览量缓存失败:', error)
    }
  }, [promptId])

  // 获取点赞状态和统计数据
  const refreshStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }))

      const response = await fetch(`/api/prompts/${promptId}/like`)
      if (response.ok) {
        const data = await response.json()
        
        // 获取浏览量
        const viewResponse = await fetch(`/api/prompts/${promptId}/view`)
        let views = getViewsFromCache()
        
        if (viewResponse.ok) {
          const viewData = await viewResponse.json()
          views = Math.max(views, viewData.totalViews || 0)
          saveViewsToCache(views)
        }

        setStats({
          likes: data.totalLikes || 0,
          views,
          isLiked: data.liked || false,
          loading: false
        })
      } else {
        // 如果API失败，尝试从缓存获取数据
        const cachedViews = getViewsFromCache()
        setStats(prev => ({
          ...prev,
          views: cachedViews,
          loading: false
        }))
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      const cachedViews = getViewsFromCache()
      setStats(prev => ({
        ...prev,
        views: cachedViews,
        loading: false
      }))
    }
  }, [promptId, getViewsFromCache, saveViewsToCache])

  // 切换点赞状态
  const toggleLike = useCallback(async (): Promise<boolean> => {
    if (!session) {
      throw new Error('请先登录')
    }

    try {
      // 乐观更新
      const newLikedState = !stats.isLiked
      const newLikesCount = newLikedState ? stats.likes + 1 : stats.likes - 1
      
      setStats(prev => ({
        ...prev,
        isLiked: newLikedState,
        likes: newLikesCount
      }))

      const response = await fetch(`/api/prompts/${promptId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(prev => ({
          ...prev,
          isLiked: data.liked,
          likes: data.totalLikes
        }))
        return data.liked
      } else {
        // 回滚乐观更新
        setStats(prev => ({
          ...prev,
          isLiked: !newLikedState,
          likes: stats.likes
        }))
        throw new Error('点赞操作失败')
      }
    } catch (error) {
      // 回滚乐观更新
      setStats(prev => ({
        ...prev,
        isLiked: stats.isLiked,
        likes: stats.likes
      }))
      throw error
    }
  }, [promptId, session, stats.isLiked, stats.likes])

  // 增加浏览量
  const incrementView = useCallback(async () => {
    try {
      // 检查是否已经浏览过（防止重复计数）
      const viewedKey = `prompt_viewed_${promptId}`
      const hasViewed = sessionStorage.getItem(viewedKey)
      
      if (hasViewed) {
        return
      }

      // 标记为已浏览
      sessionStorage.setItem(viewedKey, 'true')

      // 先更新本地缓存
      const newViews = stats.views + 1
      setStats(prev => ({ ...prev, views: newViews }))
      saveViewsToCache(newViews)

      // 异步更新服务器
      const response = await fetch(`/api/prompts/${promptId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const serverViews = data.totalViews || newViews
        setStats(prev => ({ ...prev, views: serverViews }))
        saveViewsToCache(serverViews)
      }
    } catch (error) {
      console.error('更新浏览量失败:', error)
      // 不抛出错误，浏览量更新失败不应该影响用户体验
    }
  }, [promptId, stats.views, saveViewsToCache])

  // 初始化数据
  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  return {
    stats,
    toggleLike,
    incrementView,
    refreshStats
  }
}