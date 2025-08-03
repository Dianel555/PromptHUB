import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import React from "react"

export interface AuthGuardOptions {
  redirectTo?: string
  showToast?: boolean
  toastMessage?: string
}

export function useAuthGuard(options: AuthGuardOptions = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const {
    redirectTo = "/auth/signin",
    showToast = true,
    toastMessage = "请先登录以访问此功能"
  } = options

  const requireAuth = useCallback((callback?: () => void) => {
    if (status === "loading") {
      return false
    }

    if (!session) {
      // 保存当前页面URL，登录后可以返回
      const currentUrl = window.location.pathname + window.location.search
      const loginUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentUrl)}`
      
      router.push(loginUrl)
      return false
    }

    // 用户已认证，执行回调
    if (callback) {
      callback()
    }
    return true
  }, [session, status, router, redirectTo])

  const isAuthenticated = status !== "loading" && !!session
  const isLoading = status === "loading"

  return {
    isAuthenticated,
    isLoading,
    requireAuth,
    session
  }
}

// 高阶组件：为组件添加认证保护
export function withAuthGuard<T extends object>(
  Component: React.ComponentType<T>,
  options: AuthGuardOptions = {}
) {
  return function AuthGuardedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuthGuard(options)

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null // 或者返回一个占位符组件
    }

    return <Component {...props} />
  }
}