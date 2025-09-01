"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function AuthButton() {
  const { data: session, status } = useSession()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      // 登录成功后跳转到个人提示词主界面
      await signIn("github", { callbackUrl: "/prompts" })
    } catch (error) {
      console.error("登录失败:", error)
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("登出失败:", error)
      setIsSigningOut(false)
    }
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Icons.spinner className="mr-2 size-4 animate-spin" />
        加载中...
      </Button>
    )
  }

  if (session) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleProfileClick}
        className="flex min-w-0 max-w-[160px] items-center space-x-2 px-3 relative"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user?.name || "用户头像"}
            width={24}
            height={24}
            className="size-6 shrink-0 rounded-full object-cover"
            onError={(e) => {
              // 头像加载失败时的处理
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <div className="size-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <span className="hidden truncate text-sm font-medium sm:inline max-w-[100px]">
          {session.user?.name}
        </span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignIn}
      disabled={isSigningIn}
    >
      {isSigningIn ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          登录中...
        </>
      ) : (
        <>
          <Icons.gitHub className="mr-2 size-4" />
          GitHub 登录
        </>
      )}
    </Button>
  )
}
