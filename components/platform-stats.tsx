"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Heart, BookmarkIcon, FileText, Star, GitFork, Users, Calendar, Loader2 } from "lucide-react"
import { useStats, useGithubStats } from "@/hooks/use-stats"

interface PlatformStats {
  totalPrompts: number
  totalUsers: number
  activeUsers: number
  totalLikes: number
  recentPrompts: number
  lastUpdated: string
}

interface GitHubStats {
  stars: number
  forks: number
  watchers: number
  lastUpdated: string
}

export function PlatformStats() {
  const { stats, isLoading: statsLoading, error: statsError } = useStats()
  const { githubStats, isLoading: githubLoading, error: githubError } = useGithubStats()

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载统计数据中...</span>
      </div>
    )
  }

  if (statsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            统计数据暂时无法加载，请稍后再试
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 平台统计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            平台统计
          </CardTitle>
          <CardDescription>
            PromptHub 平台数据概览
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.totalPrompts || 0}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <FileText className="h-4 w-4" />
                总提示词
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.totalUsers || 0}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Users className="h-4 w-4" />
                总用户
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats?.activeUsers || 0}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Eye className="h-4 w-4" />
                活跃用户
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats?.totalLikes || 0}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Heart className="h-4 w-4" />
                总点赞
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                最近7天新增: {stats?.recentPrompts || 0} 个提示词
              </Badge>
            </div>
            <div>
              最后更新: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString('zh-CN') : '未知'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GitHub 统计 */}
      {!githubLoading && !githubError && githubStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              GitHub 统计
            </CardTitle>
            <CardDescription>
              开源项目数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{githubStats.stars}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="h-4 w-4" />
                  Stars
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{githubStats.forks}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <GitFork className="h-4 w-4" />
                  Forks
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{githubStats.watchers}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4" />
                  Watchers
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-sm text-muted-foreground text-center">
              最后更新: {new Date(githubStats.lastUpdated).toLocaleString('zh-CN')}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}