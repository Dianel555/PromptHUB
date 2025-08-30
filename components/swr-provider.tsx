'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0, // 禁用自动刷新
        revalidateOnFocus: false, // 禁用焦点时重新验证
        revalidateOnReconnect: true, // 重新连接时验证
        shouldRetryOnError: false, // 禁用错误重试
        dedupingInterval: 60000, // 1分钟内去重
        errorRetryCount: 1, // 最多重试1次
        errorRetryInterval: 5000, // 重试间隔5秒
        onError: (error: any) => {
          console.error('SWR Error:', error)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}