"use client"

import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserStats } from "@/components/user-stats"
import { 
  User, 
  Settings, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit,
  Camera,
  Mail,
  Calendar,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
    achievements: ["活跃用户", "创作达人", "社区贡献者"]
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
      href: "/profile/edit"
    },
    {
      icon: Settings,
      title: "账户设置",
      description: "密码、隐私等设置",
      href: "/profile/settings"
    },
    {
      icon: Shield,
      title: "隐私设置",
      description: "控制您的隐私偏好",
      href: "/profile/privacy"
    },
    {
      icon: HelpCircle,
      title: "帮助中心",
      description: "获取帮助和支持",
      href: "/help"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* 页面头部 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">个人中心</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">管理您的账户信息和偏好设置</p>
          </div>
          <Button variant="outline" size="icon" className="self-start sm:self-auto">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* 左侧用户信息卡片 */}
          <div className="lg:col-span-1">
            <Card className="relative">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto">
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
                    className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    onClick={() => {/* TODO: 实现头像上传 */}}
                  >
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-4">
                  <CardTitle className="text-xl">
                    {session.user?.name || "未设置用户名"}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    {session.user?.email}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>加入时间: 2024年1月</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">活跃用户</Badge>
                  <Badge variant="outline">GitHub认证</Badge>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => router.push("/profile/edit")}
                >
                  <Edit className="h-4 w-4 mr-2" />
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
                <CardDescription>
                  管理您的账户设置和偏好
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer group active:scale-[0.98] touch-manipulation"
                    onClick={() => {
                      router.push(item.href)
                    }}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="p-2 rounded-md bg-primary/10 flex-shrink-0">
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base truncate">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-2" />
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
                  <LogOut className="h-4 w-4 mr-2" />
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