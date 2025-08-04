"use client"

import { motion } from "framer-motion"
import { Code, Github, Heart, Users } from "lucide-react"

export function CommunityFooter() {
  return (
    <footer className="glass-effect mt-20 border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 项目介绍 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <span className="gradient-text text-xl font-bold">PromptHUB</span>
            </div>
            <p className="text-sm text-gray-400">
              开源的AI提示词分享社区，致力于为创作者提供自由交流和协作的平台。
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Heart className="size-4 text-red-400" />
              <span>由社区驱动，为社区服务</span>
            </div>
          </div>

          {/* 社区链接 */}
          <div>
            <h3 className="mb-4 flex items-center font-semibold text-foreground">
              <Users className="mr-2 size-4" />
              社区
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="flex items-center transition-colors hover:text-foreground"
                >
                  <Github className="mr-2 size-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  贡献指南
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  问题反馈
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  讨论区
                </a>
              </li>
            </ul>
          </div>

          {/* 技术信息 */}
          <div>
            <h3 className="mb-4 flex items-center font-semibold text-foreground">
              <Code className="mr-2 size-4" />
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
                <a href="#" className="transition-colors hover:text-foreground">
                  部署文档
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
            <p>
              &copy; 2024 PromptHUB 开源社区 ·
              <a
                href="#"
                className="ml-1 transition-colors hover:text-foreground"
              >
                MIT License
              </a>
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                whileHover={{ scale: 1.1 }}
              >
                <Github className="size-5" />
              </motion.a>
              <span className="text-xs text-gray-500">构建于开源技术栈</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
