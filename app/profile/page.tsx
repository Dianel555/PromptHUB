"use client"

import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
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
import { UserStats } from "@/components/user-stats"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  // 模拟用户统计数据
  const userStats = {
    totalLikes: 156,
    totalViews: 2340,
    totalPrompts: 12,
    joinDate: "2024-01-15",
    favoritePrompts: 28,
    followers: 45,
    following: 23,
    achievements: ["活跃用户", "创作达人", "社区贡献者"],
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  const menuItems = [
    {
      icon: User,
      title: "个人资料",
      description: "管理您的基本信息",
      href: "/profile/edit",
    },
    {
      icon: Settings,
      title: "账户设置",
      description: "密码、隐私等设置",
      href: "/profile/settings",
    },
    {
      icon: Shield,
      title: "隐私设置",
      description: "控制您的隐私偏好",
      href: "/profile/privacy",
    },
    {
      icon: HelpCircle,
      title: "帮助中心",
      description: "获取帮助和支持",
      href: "/help",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* 页面头部 */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              个人中心
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
              管理您的账户信息和偏好设置
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="self-start sm:self-auto"
          >
            <Settings className="size-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* 左侧用户信息卡片 */}
          <div className="lg:col-span-1">
            <Card className="relative">
              <CardHeader className="pb-4 text-center">
                <div className="relative mx-auto">
                  <Avatar className="mx-auto size-20 sm:size-24">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || "用户头像"}
                    />
                    <AvatarFallback className="text-base sm:text-lg">
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 size-7 rounded-full sm:-bottom-2 sm:-right-2 sm:size-8"
                    onClick={() => {
                      /* TODO: 实现头像上传 */
                    }}
                  >
                    <Camera className="size-3 sm:size-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <CardTitle className="text-xl">
                    {session.user?.name || "未设置用户名"}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <Mail className="size-4" />
                    {session.user?.email}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>加入时间: 2024年1月</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">活跃用户</Badge>
                  <Badge variant="outline">GitHub认证</Badge>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => router.push("/profile/edit")}
                >
                  <Edit className="mr-2 size-4" />
                  编辑资料
                </Button>
              </CardContent>
            </Card>

            {/* 统计信息组件 */}
            <div className="mt-6">
              <UserStats stats={userStats} />
            </div>
          </div>

          {/* 右侧功能菜单 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>功能菜单</CardTitle>
                <CardDescription>管理您的账户设置和偏好</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="group flex cursor-pointer touch-manipulation items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98] sm:p-4"
                    onClick={() => {
                      router.push(item.href)
                    }}
                  >
                    <div className="flex min-w-0 flex-1 items-center space-x-3 sm:space-x-4">
                      <div className="shrink-0 rounded-md bg-primary/10 p-2">
                        <item.icon className="size-4 text-primary sm:size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium sm:text-base">
                          {item.title}
                        </h3>
                        <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="ml-2 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground sm:size-5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 危险操作区域 */}
            <Card className="mt-6 border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">危险操作</CardTitle>
                <CardDescription>
                  这些操作可能会影响您的账户安全
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  <LogOut className="mr-2 size-4" />
                  退出登录
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
