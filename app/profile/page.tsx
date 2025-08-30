"use client"

import { useState, useEffect } from "react"
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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userStats, setUserStats] = useState({
    totalLikes: 0,
    totalViews: 0,
    totalPrompts: 0,
    joinDate: new Date().toISOString().split('T')[0],
    favoritePrompts: 0,
    followers: 0,
    following: 0,
    achievements: ["新用户"],
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // 获取真实用户统计数据
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserStats()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (error) {
      console.error("获取用户统计数据失败:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 用户信息卡片 */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
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
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">
                  {session?.user?.name || "未知用户"}
                </h1>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  {session?.user?.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  加入时间: {userStats.joinDate}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {isLoadingStats ? "..." : userStats.totalLikes}
              </div>
              <div className="text-sm text-muted-foreground">获得点赞</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {isLoadingStats ? "..." : userStats.totalViews}
              </div>
              <div className="text-sm text-muted-foreground">总浏览量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {isLoadingStats ? "..." : userStats.totalPrompts}
              </div>
              <div className="text-sm text-muted-foreground">创建提示词</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {isLoadingStats ? "..." : userStats.favoritePrompts}
              </div>
              <div className="text-sm text-muted-foreground">收藏提示词</div>
            </div>
          </div>
          
          {/* 成就徽章 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">成就徽章</h3>
            <div className="flex flex-wrap gap-2">
              {userStats.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary">
                  {achievement}
                </Badge>
              ))}
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
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}