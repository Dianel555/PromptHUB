"use client"

import { Suspense } from "react"
import { useStats } from "@/hooks/use-stats"

interface ProfileStatsProps {
  className?: string
}

function StatsContent({ className }: ProfileStatsProps) {
  const { stats, isLoading } = useStats()

  const userStats = {
    totalLikes: stats?.totalLikes || 0,
    totalViews: stats?.totalViews || 0,
    totalPrompts: stats?.totalPrompts || 0,
    totalCollections: stats?.totalCollections || 0,
  }

  return (
    <div className={`grid grid-cols-2 gap-4 md:grid-cols-4 ${className}`}>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            userStats.totalLikes
          )}
        </div>
        <div className="text-sm text-muted-foreground">获得点赞</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            userStats.totalViews
          )}
        </div>
        <div className="text-sm text-muted-foreground">总浏览量</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            userStats.totalPrompts
          )}
        </div>
        <div className="text-sm text-muted-foreground">创建提示词</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {isLoading && !stats ? (
            <div className="animate-pulse bg-muted rounded w-8 h-8 mx-auto"></div>
          ) : (
            userStats.totalCollections
          )}
        </div>
        <div className="text-sm text-muted-foreground">收藏提示词</div>
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