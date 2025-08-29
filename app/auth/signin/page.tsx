"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Github, Mail } from "lucide-react"
import { getProviders, signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function SignInContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl") || "/prompts"

  const [providers, setProviders] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      })

      if (result?.ok) {
        router.push(callbackUrl)
      } else {
        console.error("登录失败")
      }
    } catch (error) {
      console.error("登录错误:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 size-4" />
            返回
          </Button>
        </motion.div>

        <Card className="glass-effect border-0 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"
            >
              <span className="text-2xl font-bold text-white">P</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-foreground">
              欢迎回来
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              登录以访问完整功能和个性化体验
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 邮箱登录表单 */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-effect border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="输入您的密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="glass-effect border-border/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>

            {/* 分隔线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或者使用
                </span>
              </div>
            </div>

            {/* 第三方登录 */}
            <div className="space-y-3">
              {providers && providers.github && (
                <Button
                  variant="outline"
                  onClick={() => handleProviderSignIn("github")}
                  className="glass-effect w-full border-border/50 hover:bg-accent/10"
                >
                  <Github className="mr-2 size-4" />
                  使用 GitHub 登录
                </Button>
              )}

              {providers && providers.google && (
                <Button
                  variant="outline"
                  onClick={() => handleProviderSignIn("google")}
                  className="glass-effect w-full border-border/50 hover:bg-accent/10"
                >
                  <Mail className="mr-2 size-4" />
                  使用 Google 登录
                </Button>
              )}
            </div>

            {/* 注册链接 */}
            <div className="text-center text-sm text-muted-foreground">
              还没有账户？{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-purple-500 transition-colors hover:text-purple-400"
              >
                立即注册
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        {callbackUrl !== "/" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-effect mt-4 rounded-lg p-3 text-center text-sm text-muted-foreground"
          >
            登录后将返回到您之前访问的页面
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
