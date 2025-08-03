"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button variant="ghost" size="sm" disabled>加载中...</Button>
  }

  if (session) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
      >
        退出登录
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signIn("github")}
    >
      <Icons.gitHub className="mr-2 h-4 w-4" />
      GitHub 登录
    </Button>
  )
}