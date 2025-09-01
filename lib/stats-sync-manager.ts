import React from 'react'

/**
 * 统计数据同步管理器
 * 确保各页面间的统计数据实时同步
 */

export interface UserStats {
  totalLikes: number
  totalViews: number
  totalPrompts: number
  totalCollections: number
  lastUpdated: string
}

class StatsSyncManager {
  private static instance: StatsSyncManager
  private listeners: Set<(stats: UserStats) => void> = new Set()
  private currentStats: UserStats | null = null
  private syncInterval: NodeJS.Timeout | null = null

  public static getInstance(): StatsSyncManager {
    if (!StatsSyncManager.instance) {
      StatsSyncManager.instance = new StatsSyncManager()
    }
    return StatsSyncManager.instance
  }

  /**
   * 初始化同步管理器
   */
  public initialize() {
    this.loadStats()
    this.startSyncInterval()
    
    // 监听localStorage变化
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this))
    }
  }

  /**
   * 销毁同步管理器
   */
  public destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange.bind(this))
    }
    
    this.listeners.clear()
  }

  /**
   * 订阅统计数据变化
   */
  public subscribe(callback: (stats: UserStats) => void): () => void {
    this.listeners.add(callback)
    
    // 立即发送当前数据
    if (this.currentStats) {
      callback(this.currentStats)
    }
    
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 手动触发统计数据更新
   */
  public forceUpdate() {
    this.loadStats()
    this.notifyListeners()
  }

  /**
   * 获取当前统计数据
   */
  public getCurrentStats(): UserStats | null {
    return this.currentStats
  }

  /**
   * 加载统计数据
   */
  private loadStats() {
    try {
      const { getUserStats } = require('./prompt-storage')
      const stats = getUserStats()
      
      this.currentStats = {
        totalLikes: stats.totalLikes || 0,
        totalViews: stats.totalViews || 0,
        totalPrompts: stats.totalPrompts || 0,
        totalCollections: 0, // 暂时设为0，后续可扩展
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
      this.currentStats = {
        totalLikes: 0,
        totalViews: 0,
        totalPrompts: 0,
        totalCollections: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners() {
    if (this.currentStats) {
      this.listeners.forEach(callback => {
        try {
          callback(this.currentStats!)
        } catch (error) {
          console.error('统计数据监听器执行失败:', error)
        }
      })
    }
  }

  /**
   * 处理localStorage变化
   */
  private handleStorageChange(event: StorageEvent) {
    if (event.key === 'user_stats' || event.key === 'user_prompts') {
      this.loadStats()
      this.notifyListeners()
    }
  }

  /**
   * 启动同步间隔
   */
  private startSyncInterval() {
    // 每30秒检查一次数据变化
    this.syncInterval = setInterval(() => {
      const oldStats = this.currentStats
      this.loadStats()
      
      // 检查数据是否有变化
      if (this.hasStatsChanged(oldStats, this.currentStats)) {
        this.notifyListeners()
      }
    }, 30000)
  }

  /**
   * 检查统计数据是否有变化
   */
  private hasStatsChanged(oldStats: UserStats | null, newStats: UserStats | null): boolean {
    if (!oldStats || !newStats) return true
    
    return (
      oldStats.totalLikes !== newStats.totalLikes ||
      oldStats.totalViews !== newStats.totalViews ||
      oldStats.totalPrompts !== newStats.totalPrompts ||
      oldStats.totalCollections !== newStats.totalCollections
    )
  }
}

// 导出单例实例
export const statsSyncManager = StatsSyncManager.getInstance()

/**
 * React Hook for using stats sync
 */
export function useStatsSync() {
  const [stats, setStats] = React.useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // 初始化同步管理器
    statsSyncManager.initialize()
    
    // 订阅数据变化
    const unsubscribe = statsSyncManager.subscribe((newStats) => {
      setStats(newStats)
      setIsLoading(false)
    })

    // 获取初始数据
    const currentStats = statsSyncManager.getCurrentStats()
    if (currentStats) {
      setStats(currentStats)
      setIsLoading(false)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const refreshStats = React.useCallback(() => {
    statsSyncManager.forceUpdate()
  }, [])

  return {
    stats,
    isLoading,
    refreshStats
  }
}