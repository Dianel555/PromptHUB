"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: 实现搜索功能，跳转到搜索结果页面
      console.log("搜索:", searchQuery)
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleExplore = () => {
    // 跳转到提示词浏览页面
    router.push("/prompts")
  }

  const handleContribute = () => {
    // 跳转到创建提示词页面
    router.push("/create")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative overflow-hidden px-4 py-20">
      {/* 背景粒子效果 */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="space-y-8 text-center">
          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <motion.div
              className="glass-effect mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/20 px-4 py-2 text-sm text-foreground/90 dark:border-border/80 dark:bg-background/40 dark:text-foreground/95"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="size-4 text-primary dark:text-primary/90" />
              发现最佳AI提示词
            </motion.div>

            <h1 className="text-4xl font-bold leading-relaxed md:text-6xl lg:text-7xl">
              <span className="paper:from-amber-600 paper:via-orange-500 paper:to-red-500 eyecare:from-green-500 eyecare:via-emerald-400 eyecare:to-teal-400 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400">
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
            className="mx-auto max-w-2xl"
          >
            <div className="group relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl" />
              <div className="glass-effect relative flex items-center rounded-full p-2">
                <Search className="ml-4 size-5 text-gray-400" />
                <Input
                  placeholder="搜索提示词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-0 bg-transparent px-4 text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  onClick={handleSearch}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-200"
                >
                  搜索
                </Button>
              </div>
            </div>
          </motion.div>

          {/* CTA按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={handleExplore}
              className="rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-cyan-600 hover:shadow-xl"
            >
              开始探索
              <ArrowRight className="ml-2 size-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleContribute}
              className="rounded-full border-border px-8 py-3 text-lg text-foreground backdrop-blur-sm hover:bg-accent"
            >
              贡献提示词
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
              { label: "提示词数量", value: "10,000+" },
              { label: "社区贡献者", value: "1,000+" },
              { label: "GitHub Stars", value: "5,000+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-effect rounded-2xl p-6 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="gradient-text mb-2 text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}