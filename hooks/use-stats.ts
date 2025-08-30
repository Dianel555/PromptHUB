import useSWR from 'swr'

interface Stats {
  totalPrompts: number
  totalViews: number
  totalLikes: number
  totalCollections: number
  totalUsers: number
  activeUsers: number
  recentPrompts: number
  lastUpdated: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch stats')
  }
  return res.json()
}

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR<Stats>('/api/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 300000, // 5分钟内不重复请求
    refreshInterval: 0, // 禁用自动刷新
    errorRetryCount: 1,
    shouldRetryOnError: false,
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