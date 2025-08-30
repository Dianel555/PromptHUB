"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, Users, BookOpen, TrendingUp } from "lucide-react"

interface PlatformStats {
  totalPrompts: number
  totalUsers: number
  githubStars: number
}

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState<PlatformStats>({
    totalPrompts: 0,
    totalUsers: 0,
    githubStars: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // 获取统计数据
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 并行获取平台统计和GitHub统计
      const [platformResponse, githubResponse] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/github/stats")
      ])

      const platformData = await platformResponse.json()
      const githubData = await githubResponse.json()

      setStats({
        totalPrompts: platformData.totalPrompts || 0,
        totalUsers: platformData.totalUsers || 0,
        githubStars: githubData.stars || 0
      })
    } catch (error) {
      console.error("获取统计数据失败:", error)
      // 保持默认值
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/prompts?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleExplore = () => {
    // 跳转到提示词浏览页面
    router.push("/prompts")
  }

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M+"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+"
    }
    return num.toString()
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-1/4 size-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          {/* 标签 */}
          <motion.div
            className="mb-8 inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="size-4 text-primary dark:text-primary/90" />
            发现最佳AI提示词
          </motion.div>

          {/* 主标题 */}
          <h1 className="text-4xl font-bold leading-relaxed md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              PromptHUB
            </span>
            <br />
            <span className="mt-4 block bg-gradient-to-r from-foreground/90 via-foreground/80 to-foreground/90 bg-clip-text text-transparent">
              开放提示词社区
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            开源的提示词分享平台，让创作者自由交流和协作。
          </p>
        </motion.div>

        {/* 搜索框 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <div className="glass-effect relative flex items-center rounded-full p-2">
            <Search className="ml-4 size-5 text-gray-400" />
            <Input
              placeholder="搜索提示词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0"
            />
            <Button
              onClick={handleSearch}
              className="mr-2 rounded-full"
              disabled={!searchQuery.trim()}
            >
              搜索
            </Button>
          </div>
        </motion.div>

        {/* 行动按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <Button size="lg" onClick={handleExplore} className="min-w-[200px]">
            <BookOpen className="mr-2 size-5" />
            探索提示词
          </Button>
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3"
        >
          {[
            { 
              label: "提示词数量", 
              value: isLoadingStats ? "..." : formatNumber(stats.totalPrompts),
              icon: BookOpen,
              color: "text-blue-500"
            },
            { 
              label: "社区贡献者", 
              value: isLoadingStats ? "..." : formatNumber(stats.totalUsers),
              icon: Users,
              color: "text-green-500"
            },
            { 
              label: "GitHub Stars", 
              value: isLoadingStats ? "..." : formatNumber(stats.githubStars),
              icon: Star,
              color: "text-yellow-500"
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-effect rounded-2xl p-8 text-center backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-background/50 ${stat.color}`}>
                <stat.icon className="size-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 实时更新提示 */}
        {!isLoadingStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 flex items-center justify-center space-x-2 text-sm text-muted-foreground"
          >
            <TrendingUp className="size-4" />
            <span>数据实时更新</span>
          </motion.div>
        )}
      </div>
    </section>
  )
}