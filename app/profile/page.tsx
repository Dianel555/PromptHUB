"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Camera,
  ChevronRight,
  Edit,
  HelpCircle,
  LogOut,
  Mail,
  Settings,
  Shield,
  User,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import ProfileStats from "@/components/profile/ProfileStats"
import ErrorBoundary from "@/components/ErrorBoundary"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useUser()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        加载中...
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const menuItems = [
    {
      icon: Edit,
      label: "编辑资料",
      href: "/profile/edit",
      description: "更新您的个人信息",
    },
    {
      icon: Settings,
      label: "账户设置",
      href: "/profile/settings",
      description: "管理您的账户偏好",
    },
    {
      icon: Shield,
      label: "隐私设置",
      href: "/profile/privacy",
      description: "控制您的隐私选项",
    },
    {
      icon: HelpCircle,
      label: "帮助中心",
      href: "/help",
      description: "获取帮助和支持",
    },
  ]

  return (
    <ErrorBoundary>
      <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* 用户信息卡片 */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="size-20">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "用户头像"}
                  />
                  <AvatarFallback className="text-lg">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 size-8 rounded-full p-0"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Camera className="size-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">
                  {session?.user?.name || "未知用户"}
                </h1>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 size-4" />
                  {session?.user?.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 size-4" />
                  加入时间: {new Date().toISOString().split("T")[0]}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <ProfileStats />
          </div>

          {/* 成就徽章 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">成就徽章</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">新用户</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 菜单选项 */}
      <div className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => router.push(item.href)}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <item.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 退出登录按钮 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 size-4" />
            退出登录
          </Button>
        </CardContent>
      </Card>
      </div>
    </ErrorBoundary>
  )
}
