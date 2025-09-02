"use client"

import { Suspense } from "react"
import { useStatsSync } from "@/lib/stats-sync-manager"

interface ProfileStatsProps {
  className?: string
}

function StatsContent({ className }: ProfileStatsProps) {
  const { stats, isLoading } = useStatsSync()

  const userStats = {
    totalLikes: stats?.totalLikes || 0,
    totalViews: stats?.totalViews || 0,
    totalPrompts: stats?.totalPrompts || 0,
    totalCollections: stats?.totalCollections || 0,
  }

  // 检查是否所有数据都为0（新用户或数据为空）
  const hasNoData = Object.values(userStats).every(value => value === 0)

  if (hasNoData && !isLoading) {
    return (
      <div className={`text-center py-8 px-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30 ${className}`}>
        <div className="text-4xl mb-2">📊</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">暂无统计数据</h3>
        <p className="text-sm text-muted-foreground">
          开始创建您的第一个提示词，数据将会在这里显示
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 gap-4 md:grid-cols-4 ${className}`}>
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground dark:text-white">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            <span className="text-primary font-extrabold">{userStats.totalLikes || 0}</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground font-medium">获得点赞</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground dark:text-white">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            <span className="text-primary font-extrabold">{userStats.totalViews || 0}</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground font-medium">总浏览量</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground dark:text-white">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            <span className="text-primary font-extrabold">{userStats.totalPrompts || 0}</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground font-medium">创建提示词</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground dark:text-white">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            <span className="text-primary font-extrabold">{userStats.totalCollections || 0}</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground font-medium">收藏提示词</div>
      </div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="text-center">
          <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto mb-2"></div>
          <div className="animate-pulse bg-muted rounded w-16 h-4 mx-auto"></div>
        </div>
      ))}
    </div>
  )
}

export default function ProfileStats({ className }: ProfileStatsProps) {
  return (
    <Suspense fallback={<StatsSkeleton />}>
      <StatsContent className={className} />
    </Suspense>
  )
}