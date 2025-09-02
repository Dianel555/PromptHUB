import useSWR from 'swr'

interface Stats {
  totalPrompts: number
  favoritePrompts: number
  totalLikes: number
  totalViews: number
  followersCount: number
  followingCount: number
  achievements: string[]
  totalUsers: number
  activeUsers: number
  recentPrompts: number
  lastUpdated: string
}

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`API请求失败: ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    
    // 验证返回数据的基本结构
    if (typeof data !== 'object' || data === null) {
      throw new Error('API返回数据格式错误')
    }
    
    return data
  } catch (error) {
    console.error('统计数据获取失败:', error)
    throw error
  }
}

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR<Stats>('/api/user/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 300000, // 5分钟内不重复请求
    refreshInterval: 0, // 禁用自动刷新
    errorRetryCount: 3, // 增加重试次数
    shouldRetryOnError: true,
    // 添加降级数据
    fallbackData: {
      totalPrompts: 0,
      favoritePrompts: 0,
      totalLikes: 0,
      totalViews: 0,
      followersCount: 0,
      followingCount: 0,
      achievements: [],
      totalUsers: 0,
      activeUsers: 0,
      recentPrompts: 0,
      lastUpdated: new Date().toISOString()
    }
  })

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  }
}

export function useGithubStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/github/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 600000, // 10分钟内不重复请求
    refreshInterval: 0, // 禁用自动刷新
    errorRetryCount: 1,
    shouldRetryOnError: false,
  })

  return {
    githubStats: data,
    isLoading,
    error,
    mutate,
  }
}