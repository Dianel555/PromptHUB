import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // 对于受保护的路由，如果用户未认证，重定向到登录页面
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // 需要登录的路径列表
    const protectedPaths = ["/profile", "/prompts", "/create"]
    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    )

    // 如果访问受保护页面但未登录，重定向到登录页面
    if (isProtectedPath && !token) {
      const signInUrl = new URL("/auth/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // 需要登录的路径列表
        const protectedPaths = ["/profile", "/prompts", "/create"]
        const isProtectedPath = protectedPaths.some((path) =>
          pathname.startsWith(path)
        )

        // 对于受保护页面，需要登录
        if (isProtectedPath) {
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
    "/profile/:path*",
    "/prompts/:path*",
    "/create/:path*",
    "/api/user/:path*",
  ],
}
