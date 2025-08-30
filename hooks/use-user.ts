import useSWR from 'swr'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  website: string | null
  location: string | null
  createdAt: string
  updatedAt: string
}

interface UserSettings {
  emailNotifications: boolean
  publicProfile: boolean
  showActivity: boolean
  allowComments: boolean
}

interface PrivacySettings {
  profileVisibility: boolean
  promptsVisibility: boolean
  activityVisibility: boolean
  searchable: boolean
  allowDirectMessages: boolean
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch')
  }
  return res.json()
}

// 用户基本信息hook
export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>('/api/user', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1分钟内不重复请求
  })

  const updateUser = async (userData: Partial<UserProfile>) => {
    try {
      // 乐观更新
      const optimisticData = data ? { ...data, ...userData } : undefined
      
      const updatedUser = await mutate(
        async () => {
          const res = await fetch('/api/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          })
          
          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || '更新失败')
          }
          
          const result = await res.json()
          return result.user || result
        },
        {
          optimisticData,
          rollbackOnError: true,
        }
      )
      
      toast.success('个人资料更新成功')
      return updatedUser
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '更新失败，请重试')
      throw error
    }
  }

  return {
    user: data,
    isLoading,
    error,
    updateUser,
    mutate,
  }
}

// 用户设置hook
export function useUserSettings() {
  const { data, error, isLoading, mutate } = useSWR<UserSettings>('/api/user/settings', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  })

  const updateSettings = async (settings: Partial<UserSettings>) => {
    try {
      const optimisticData = data ? { ...data, ...settings } : undefined
      
      const updatedSettings = await mutate(
        async () => {
          const res = await fetch('/api/user/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
          })
          
          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || '保存失败')
          }
          
          return res.json()
        },
        {
          optimisticData,
          rollbackOnError: true,
        }
      )
      
      toast.success('设置保存成功')
      return updatedSettings
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败，请重试')
      throw error
    }
  }

  return {
    settings: data,
    isLoading,
    error,
    updateSettings,
    mutate,
  }
}

// 隐私设置hook
export function usePrivacySettings() {
  const { data, error, isLoading, mutate } = useSWR<PrivacySettings>('/api/user/privacy', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  })

  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    try {
      const optimisticData = data ? { ...data, ...settings } : undefined
      
      const updatedSettings = await mutate(
        async () => {
          const res = await fetch('/api/user/privacy', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
          })
          
          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || '保存失败')
          }
          
          return res.json()
        },
        {
          optimisticData,
          rollbackOnError: true,
        }
      )
      
      toast.success('隐私设置保存成功')
      return updatedSettings
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败，请重试')
      throw error
    }
  }

  return {
    settings: data,
    isLoading,
    error,
    updatePrivacySettings,
    mutate,
  }
}