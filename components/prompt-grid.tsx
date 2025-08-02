'use client'

import { motion } from 'framer-motion'
import { PromptCard } from './prompt-card'

// 模拟数据
const mockPrompts = [
  {
    id: '1',
    title: 'AI图像生成专家',
    description: '创建令人惊叹的详细图像，包含风格修饰符、构图指南和高级参数控制。适用于各种AI图像生成工具。',
    author: { name: 'Alex Chen', avatar: '/placeholder.svg?height=32&width=32' },
    tags: ['图像', '艺术', '精选'],
    likes: 1250,
    views: 8900,
    featured: true
  },
  {
    id: '2',
    title: '内容写作助手',
    description: '简化您的内容创作流程，适用于博客、文章和社交媒体帖子的多功能写作提示词。',
    author: { name: 'Sarah Kim', avatar: '/placeholder.svg?height=32&width=32' },
    tags: ['写作', '内容'],
    likes: 890,
    views: 5600
  },
  {
    id: '3',
    title: '代码调试器',
    description: '高效识别和修复代码中的错误，支持多种编程语言的结构化调试提示词。',
    author: { name: 'Mike Johnson', avatar: '/placeholder.svg?height=32&width=32' },
    tags: ['代码', '开发'],
    likes: 2100,
    views: 12000
  },
  {
    id: '4',
    title: '学术研究助手',
    description: '通过结构化的文献综述、方法论建议和引用格式来增强您的研究过程。',
    author: { name: 'Dr. Brown', avatar: '/placeholder.svg?height=32&width=32' },
    tags: ['学术', '研究', '精选'],
    likes: 1450,
    views: 9800,
    featured: true
  },
  {
    id: '5',
    title: '开源项目文档生成器',
    description: '为开源项目创建清晰、全面的README和技术文档，提升项目可读性。',
    author: { name: 'Emma Davis', avatar: '/placeholder.svg?height=32&width=32' },
    tags: ['开源', '文档'],
    likes: 980,
    views: 6700
  },
  {
    id: '6',
    title: '社区讨论主持人',
    description: '引导和促进技术社区讨论，创建包容性的交流环境。',
    author: { name: 'Community Team', avatar: '/placeholder.svg?height=32&width=32' },
    tags: ['社区', '协作'],
    likes: 750,
    views: 4200
  }
]

interface PromptGridProps {
  searchQuery?: string
  selectedCategory?: string
}

export function PromptGrid({ searchQuery = '', selectedCategory = '' }: PromptGridProps) {
  // 过滤提示词
  const filteredPrompts = mockPrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || prompt.tags.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            社区精选提示词
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            发现由开源社区精心制作的高质量提示词，共同提升AI体验
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {['全部', '图像', '写作', '代码', '学术', '开源', '社区'].map((category, index) => (
            <motion.button
              key={category}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category || (category === '全部' && !selectedCategory)
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                  : 'glass-effect text-muted-foreground hover:text-foreground hover:bg-accent/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* 提示词网格 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <PromptCard {...prompt} />
            </motion.div>
          ))}
        </motion.div>

        {/* 加载更多按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            className="glass-effect px-8 py-3 rounded-full text-foreground font-medium hover:bg-accent/10 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            加载更多提示词
          </motion.button>
        </motion.div>

        {/* 空状态 */}
        {filteredPrompts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                未找到匹配的提示词
              </h3>
              <p className="text-gray-400">
                尝试调整搜索条件或浏览其他分类
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}