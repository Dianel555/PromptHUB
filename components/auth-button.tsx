"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function AuthButton() {
  const { data: session, status } = useSession()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signIn("github", { callbackUrl: "/" })
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

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        加载中...
      </Button>
    )
  }

  if (session) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            退出中...
          </>
        ) : (
          "退出登录"
        )}
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
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          登录中...
        </>
      ) : (
        <>
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub 登录
        </>
      )}
    </Button>
  )
}
