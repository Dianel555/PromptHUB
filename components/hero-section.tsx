'use client'

import { motion } from 'framer-motion'
import { Search, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: 实现搜索功能，跳转到搜索结果页面
      console.log('搜索:', searchQuery)
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleExplore = () => {
    // 跳转到提示词浏览页面
    router.push('/prompts')
  }

  const handleContribute = () => {
    // 跳转到创建提示词页面
    router.push('/create')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* 背景粒子效果 */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-sm text-purple-200 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4" />
              发现最佳AI提示词
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="gradient-text">PromptHUB</span>
              <br />
              <span className="text-foreground">开放提示词社区</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              开源的提示词分享平台，让创作者自由交流和协作。
            </p>
          </motion.div>

          {/* 搜索框 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative flex items-center glass-effect rounded-full p-2">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <Input
                  placeholder="搜索提示词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-lg px-4"
                />
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full px-6"
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
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg"
              onClick={handleExplore}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              开始探索
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleContribute}
              className="border-border text-foreground hover:bg-accent px-8 py-3 rounded-full text-lg backdrop-blur-sm"
            >
              贡献提示词
            </Button>
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16"
          >
            {[
              { label: '提示词数量', value: '10,000+' },
              { label: '社区贡献者', value: '1,000+' },
              { label: 'GitHub Stars', value: '5,000+' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-effect rounded-2xl p-6 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}