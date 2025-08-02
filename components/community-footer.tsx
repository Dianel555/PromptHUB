'use client'

import { motion } from 'framer-motion'
import { Github, Heart, Code, Users } from 'lucide-react'

export function CommunityFooter() {
  return (
    <footer className="glass-effect border-t border-white/10 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 项目介绍 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold gradient-text">PromptHUB</span>
            </div>
            <p className="text-gray-400 text-sm">
              开源的AI提示词分享社区，致力于为创作者提供自由交流和协作的平台。
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>由社区驱动，为社区服务</span>
            </div>
          </div>
          
          {/* 社区链接 */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              社区
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-foreground transition-colors flex items-center">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  贡献指南
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  问题反馈
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  讨论区
                </a>
              </li>
            </ul>
          </div>
          
          {/* 技术信息 */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              开发者
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <span className="text-purple-400">Next.js</span> + React
              </li>
              <li>
                <span className="text-cyan-400">Tailwind CSS</span> + shadcn/ui
              </li>
              <li>
                <span className="text-green-400">TypeScript</span>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  部署文档
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>
              &copy; 2024 PromptHUB 开源社区 · 
              <a href="#" className="hover:text-foreground transition-colors ml-1">
                MIT License
              </a>
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <span className="text-xs text-gray-500">
                构建于开源技术栈
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}