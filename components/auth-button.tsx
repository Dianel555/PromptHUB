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
      // 登录成功后跳转到个人中心页面
      await signIn("github", { callbackUrl: "/profile" })
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
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleProfileClick}
          className="flex items-center space-x-2"
        >
          <Image
            src={session.user?.image || ""}
            alt={session.user?.name || "用户头像"}
            width={24}
            height={24}
            className="size-6 rounded-full"
          />
          <span className="hidden sm:inline">{session.user?.name}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <Icons.spinner className="mr-2 size-4 animate-spin" />
              退出中...
            </>
          ) : (
            "退出"
          )}
        </Button>
      </div>
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
