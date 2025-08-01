# PromptHUB - 开源提示词分享平台

<div align="center">
  <h1>🚀 PromptHUB</h1>
  <p>开放的提示词社区，让创作者自由交流和协作</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=flat-square&logo=next.js)
  ![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
</div>

## ✨ 特性

- 🎨 **多主题系统** - 支持白天、黑夜、护眼、纸质、星空五种主题模式
- 🏷️ **智能标签系统** - 12色动态标签，根据内容自动分配颜色
- 🔍 **智能搜索** - 支持标题、描述、标签的全文搜索
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **性能优化** - 基于Next.js 13的现代化架构
- 🎭 **玻璃拟态UI** - 现代化的视觉设计语言
- 🌟 **动画效果** - 流畅的交互动画和过渡效果

## 🛠️ 技术栈

- **前端框架**: Next.js 13.5 + React 18
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS
- **组件库**: shadcn/ui
- **动画库**: Framer Motion
- **主题系统**: next-themes
- **图标库**: Lucide React

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/prompthub.git
cd prompthub
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
prompthub/
├── app/                    # Next.js 13 App Router
│   ├── demo/              # 功能演示页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── colorful-tag.tsx  # 多彩标签组件
│   ├── hero-section.tsx  # 首页英雄区域
│   ├── prompt-card.tsx   # 提示词卡片
│   ├── prompt-grid.tsx   # 提示词网格
│   ├── theme-provider.tsx # 主题提供者
│   └── theme-toggle.tsx  # 主题切换器
├── lib/                  # 工具库
│   ├── themes.ts         # 主题配置
│   └── utils.ts          # 工具函数
├── styles/               # 样式文件
│   └── globals.css       # 全局CSS样式
├── public/               # 静态资源
└── config/               # 配置文件
```

## 🎨 主题系统

PromptHUB 支持五种主题模式：

### 🌞 白天模式
- 清爽的白色背景
- 深色文字，确保良好的对比度
- 适合日间使用

### 🌙 黑夜模式
- 深色背景，减少眼部疲劳
- 浅色文字和UI元素
- 适合夜间使用

### 👁️ 护眼模式
- 柔和的绿色调背景
- 降低蓝光，保护视力
- 长时间使用的理想选择

### 📄 纸质模式
- 温暖的米白色背景
- 纸质纹理效果
- 模拟纸质阅读体验

### ⭐ 星空模式
- 渐变的深紫色背景
- 星空般的视觉效果
- 独特的沉浸式体验

## 🏷️ 标签系统

智能的12色标签系统：

- **自动分配**: 根据标签内容的哈希值自动分配颜色
- **主题适配**: 在不同主题下自动调整颜色方案
- **一致性**: 相同内容的标签在所有主题下保持颜色一致
- **可读性**: 确保在所有主题下都有良好的对比度

支持的颜色：蓝色、绿色、紫色、红色、橙色、青色、粉色、黄色、靛蓝、柠檬绿、玫瑰红、天蓝色

## 🔧 开发指南

### 添加新主题

1. 在 `lib/themes.ts` 中添加新的主题配置
2. 在 `styles/globals.css` 中添加对应的CSS变量
3. 更新主题切换器组件

### 自定义组件

所有组件都基于 shadcn/ui 构建，支持完全的自定义：

```tsx
import { Button } from '@/components/ui/button'
import { ColorfulTag } from '@/components/colorful-tag'

export function MyComponent() {
  return (
    <div>
      <Button variant="default">按钮</Button>
      <ColorfulTag>标签</ColorfulTag>
    </div>
  )
}
```

## 📦 构建部署

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 启动生产服务器

```bash
npm start
# 或
yarn start
```

### 静态导出

```bash
npm run export
# 或
yarn export
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 使用 TypeScript 进行类型安全的开发
- 遵循 ESLint 和 Prettier 配置
- 编写清晰的提交信息
- 为新功能添加适当的测试

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

本项目的灵感来源于开源社区的优秀项目，特别感谢：

- [Next.js](https://nextjs.org/) - React 全栈框架
- [shadcn/ui](https://ui.shadcn.com/) - 现代化组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Lucide](https://lucide.dev/) - 图标库

## 📞 联系我们

- 项目主页: [GitHub Repository](https://github.com/your-username/prompthub)
- 问题反馈: [Issues](https://github.com/your-username/prompthub/issues)
- 功能建议: [Discussions](https://github.com/your-username/prompthub/discussions)

---

<div align="center">
  <p>如果这个项目对你有帮助，请给我们一个 ⭐️</p>
  <p>Made with ❤️ by the PromptHUB Team</p>
</div>