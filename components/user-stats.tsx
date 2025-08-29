"use client"

import {
  Award,
  BookOpen,
  Calendar,
  Eye,
  Heart,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserStatsProps {
  stats: {
    totalLikes: number
    totalViews: number
    totalPrompts: number
    joinDate: string
    favoritePrompts: number
    followers: number
    following: number
    achievements: string[]
  }
}

export function UserStats({ stats }: UserStatsProps) {
  const statItems = [
    {
      label: "获得点赞",
      value: stats.totalLikes,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      label: "总浏览量",
      value: stats.totalViews,
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "创建提示词",
      value: stats.totalPrompts,
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "收藏提示词",
      value: stats.favoritePrompts,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      label: "关注者",
      value: stats.followers,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "正在关注",
      value: stats.following,
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* 统计数据网格 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Card
              key={index}
              className="transition-shadow duration-200 hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-lg p-2 ${item.bgColor}`}>
                    <Icon className={`size-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formatNumber(item.value)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 加入时间 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            加入时间
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{formatDate(stats.joinDate)}</p>
        </CardContent>
      </Card>

      {/* 成就徽章 */}
      {stats.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5" />
              成就徽章
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.achievements.map((achievement, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Award className="size-3" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
