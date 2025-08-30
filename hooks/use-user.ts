import useSWR from 'swr'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  website: string | null
  location: string | null
  settings?: any
  privacy?: any
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<User>('/api/user', fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  })

  const updateUser = async (updates: Partial<User>) => {
    try {
      await mutate(async () => {
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '更新失败')
        }
        
        const result = await response.json()
        // API返回 { message, user } 结构，我们需要返回user对象
        return result.user || result
      }, { 
        optimisticData: data ? { ...data, ...updates } : undefined,
        revalidate: false 
      })
    } catch (error) {
      throw error // 不在这里显示toast，让页面组件处理
    }
  }

  return { 
    user: data, 
    isLoading, 
    error, 
    updateUser 
  }
}

export function useUserSettings() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/settings', fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  })

  const updateSettings = async (settings: any) => {
    try {
      await mutate(async () => {
        const response = await fetch('/api/user/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '设置保存失败')
        }
        
        const result = await response.json()
        // API返回 { message, settings } 结构，我们需要返回settings对象
        return result.settings || settings
      }, { 
        optimisticData: settings,
        revalidate: false 
      })
    } catch (error) {
      throw error // 不在这里显示toast，让页面组件处理
    }
  }

  return { 
    settings: data, 
    isLoading, 
    error, 
    updateSettings 
  }
}

export function useUserPrivacy() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/privacy', fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  })

  const updatePrivacy = async (privacy: any) => {
    try {
      await mutate(async () => {
        const response = await fetch('/api/user/privacy', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(privacy),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '隐私设置保存失败')
        }
        
        const result = await response.json()
        // API返回 { message, privacy } 结构，我们需要返回privacy对象
        return result.privacy || privacy
      }, { 
        optimisticData: privacy,
        revalidate: false 
      })
    } catch (error) {
      throw error // 不在这里显示toast，让页面组件处理
    }
  }

  return { 
    privacy: data, 
    isLoading, 
    error, 
    updatePrivacy 
  }
}

export function useStats() {
  const { data, error, isLoading } = useSWR('/api/stats', fetcher, {
    dedupingInterval: 300000, // 5分钟缓存
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return { 
    stats: data, 
    isLoading, 
    error 
  }
}