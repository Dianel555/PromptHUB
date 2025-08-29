"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("github", { callbackUrl: "/" })
    } catch (error) {
      console.error("登录失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full transition-all duration-200 hover:scale-105"
        size="lg"
        variant="default"
      >
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 size-4 animate-spin" />
            正在登录...
          </>
        ) : (
          <>
            <Icons.gitHub className="mr-2 size-4" />
            使用 GitHub 登录
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">安全登录，无需注册</p>
      </div>
    </div>
  )
}
