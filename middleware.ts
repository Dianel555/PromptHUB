import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // 对于受保护的路由，如果用户未认证，重定向到登录页面
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // 如果访问个人中心相关页面但未登录，重定向到登录页面
    if (pathname.startsWith('/profile') && !token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // 对于个人中心页面，需要登录
        if (pathname.startsWith('/profile')) {
          return !!token
        }
        
        // 其他页面允许访问
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/profile/:path*',
    '/api/user/:path*'
  ]
}