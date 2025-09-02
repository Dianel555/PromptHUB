// 统计数据管理器 - 处理多数据源的统计信息
export class StatsManager {
  private static instance: StatsManager
  
  public static getInstance(): StatsManager {
    if (!StatsManager.instance) {
      StatsManager.instance = new StatsManager()
    }
    return StatsManager.instance
  }

  // 获取合并的统计数据
  public async getCombinedStats(): Promise<{
    totalPrompts: number
    totalLikes: number
    totalViews: number
    source: 'api' | 'local' | 'mixed'
    lastUpdated: string
  }> {
    try {
      // 尝试从API获取数据
      const apiStats = await this.fetchApiStats()
      if (apiStats) {
        return {
          totalPrompts: apiStats.totalPrompts || 0,
          totalLikes: apiStats.totalLikes || 0,
          totalViews: apiStats.totalViews || 0,
          source: 'api',
          lastUpdated: new Date().toISOString()
        }
      }
    } catch (error) {
      console.warn('API统计数据获取失败，使用本地数据:', error)
    }

    // 降级到本地数据
    const localStats = this.getLocalStats()
    return {
      ...localStats,
      source: 'local',
      lastUpdated: new Date().toISOString()
    }
  }

  // 从API获取统计数据
  private async fetchApiStats(): Promise<any> {
    const response = await fetch('/api/user/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    return response.json()
  }

  // 获取本地统计数据
  private getLocalStats(): {
    totalPrompts: number
    totalLikes: number
    totalViews: number
  } {
    try {
      const { getUserStats } = require('./prompt-storage')
      return getUserStats()
    } catch (error) {
      console.error('获取本地统计数据失败:', error)
      return {
        totalPrompts: 0,
        totalLikes: 0,
        totalViews: 0
      }
    }
  }

  // 同步本地数据到服务器
  public async syncLocalDataToServer(): Promise<boolean> {
    try {
      const localStats = this.getLocalStats()
      
      const response = await fetch('/api/platform-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          localStats: localStats
        })
      })

      if (!response.ok) {
        throw new Error(`同步失败: ${response.status}`)
      }

      console.log('本地数据同步成功')
      return true
    } catch (error) {
      console.error('数据同步失败:', error)
      return false
    }
  }

  // 验证统计数据的一致性
  public validateStatsConsistency(stats: any): {
    isValid: boolean
    issues: string[]
  } {
    const issues: string[] = []

    if (typeof stats.totalPrompts !== 'number' || stats.totalPrompts < 0) {
      issues.push('总提示词数无效')
    }

    if (typeof stats.totalLikes !== 'number' || stats.totalLikes < 0) {
      issues.push('总点赞数无效')
    }

    if (typeof stats.totalViews !== 'number' || stats.totalViews < 0) {
      issues.push('总浏览量无效')
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }
}

// 导出单例实例
export const statsManager = StatsManager.getInstance()