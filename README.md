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
- 🏷️ **智能标签系统** - 12 色动态标签，根据内容自动分配颜色
- 🔍 **智能搜索** - 支持标题、描述、标签的全文搜索
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **性能优化** - 基于 Next.js 13 的现代化架构
- 🎭 **玻璃拟态 UI** - 现代化的视觉设计语言
- 🌟 **动画效果** - 流畅的交互动画和过渡效果
- 🔐 **GitHub 认证** - 基于 NextAuth.js 的安全认证系统
- 👤 **用户管理** - 完整的用户会话管理和状态维护

## 🛠️ 技术栈

- **前端框架**: Next.js 13.5 + React 18
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS
- **组件库**: shadcn/ui
- **动画库**: Framer Motion
- **主题系统**: next-themes
- **图标库**: Lucide React
- **认证系统**: NextAuth.js
- **数据库**: Prisma ORM
- **部署平台**: Vercel

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

## 🔧 环境变量配置

在开始之前，你需要配置以下环境变量。复制 `.env.example` 为 `.env.local` 并填入相应的值：

```bash
# NextAuth.js 认证配置
NEXTAUTH_URL=http://localhost:3000  # 生产环境请改为你的域名
NEXTAUTH_SECRET=your-secret-key-here  # 生成一个随机密钥

# GitHub OAuth 配置
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/prompthub?schema=public"
```

### GitHub OAuth 应用设置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth App
3. 配置以下信息：
   - **Application name**: PromptHUB
   - **Homepage URL**: `http://localhost:3000` (开发环境) 或 `https://your-domain.com` (生产环境)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (开发环境) 或 `https://your-domain.com/api/auth/callback/github` (生产环境)
4. 获取 Client ID 和 Client Secret，填入环境变量

## 📁 项目结构

```
prompthub/
├── app/                    # Next.js 13 App Router
│   ├── api/auth/          # NextAuth.js 认证 API
│   ├── demo/              # 功能演示页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── auth-button.tsx   # 认证按钮组件
│   ├── colorful-tag.tsx  # 多彩标签组件
│   ├── hero-section.tsx  # 首页英雄区域
│   ├── prompt-card.tsx   # 提示词卡片
│   ├── prompt-grid.tsx   # 提示词网格
│   ├── session-provider.tsx # 会话提供者
│   ├── site-header.tsx   # 网站头部
│   ├── theme-provider.tsx # 主题提供者
│   └── theme-toggle.tsx  # 主题切换器
├── lib/                  # 工具库
│   ├── auth.ts           # NextAuth.js 配置
│   ├── themes.ts         # 主题配置
│   └── utils.ts          # 工具函数
├── types/                # TypeScript 类型定义
│   └── next-auth.d.ts    # NextAuth.js 类型扩展
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
- 浅色文字和 UI 元素
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

智能的 12 色标签系统：

- **自动分配**: 根据标签内容的哈希值自动分配颜色
- **主题适配**: 在不同主题下自动调整颜色方案
- **一致性**: 相同内容的标签在所有主题下保持颜色一致
- **可读性**: 确保在所有主题下都有良好的对比度

支持的颜色：蓝色、绿色、紫色、红色、橙色、青色、粉色、黄色、靛蓝、柠檬绿、玫瑰红、天蓝色

## 🔧 开发指南

### 添加新主题

1. 在 `lib/themes.ts` 中添加新的主题配置
2. 在 `styles/globals.css` 中添加对应的 CSS 变量
3. 更新主题切换器组件

### 自定义组件

所有组件都基于 shadcn/ui 构建，支持完全的自定义：

```tsx
import { Button } from "@/components/ui/button"
import { ColorfulTag } from "@/components/colorful-tag"

export function MyComponent() {
  return (
    <div>
      <Button variant="default">按钮</Button>
      <ColorfulTag>标签</ColorfulTag>
    </div>
  )
}
```

## 📦 部署指南

PromptHUB 支持多种部署方式，您可以根据需求选择最适合的部署方案。

### 🚀 方式一：Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

#### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dianel555/PromptHUB)

#### 手动部署

1. **安装 Vercel CLI**

```bash
npm i -g vercel
```

2. **登录 Vercel**

```bash
vercel login
```

3. **部署项目**

```bash
vercel
```

4. **生产部署**

```bash
vercel --prod
```

#### 环境变量配置

如果您的项目有 `.env` 文件，需要在 Vercel 控制台中手动添加这些环境变量：

1. **登录 Vercel 控制台**
2. **进入项目设置** → **Environment Variables**
3. **添加以下环境变量**：
   - `NODE_ENV=production`
   - `NEXT_TELEMETRY_DISABLED=1`

**常见的环境变量示例**：

```bash
# 数据库配置
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# API 密钥
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 🐳 方式二：Docker 部署

使用 Docker 可以确保在任何环境中的一致性部署。

#### 使用 Docker Compose（推荐）

1. **克隆项目**

```bash
git clone https://github.com/your-username/prompthub.git
cd prompthub
```

2. **启动服务**

```bash
docker-compose up -d
```

3. **查看日志**

```bash
docker-compose logs -f
```

4. **停止服务**

```bash
docker-compose down
```

#### 使用 Dockerfile

1. **构建镜像**

```bash
docker build -t prompthub .
```

2. **运行容器**

```bash
docker run -p 3000:3000 prompthub
```

#### Docker 环境变量

可以通过环境变量配置：

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  prompthub
```

### 🖥️ 方式三：传统服务器部署

适用于 VPS、云服务器等传统部署环境。

#### 环境准备

确保服务器已安装：

- Node.js 18.0 或更高版本
- npm 或 yarn
- PM2（可选，用于进程管理）

#### 部署步骤

1. **克隆项目**

```bash
git clone https://github.com/your-username/prompthub.git
cd prompthub
```

2. **安装依赖**

```bash
npm install --production
```

3. **构建项目**

```bash
npm run build
```

4. **启动应用**

```bash
npm start
```

#### 使用 PM2 管理进程

1. **安装 PM2**

```bash
npm install -g pm2
```

2. **创建 PM2 配置文件**

```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'prompthub',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

3. **启动应用**

```bash
pm2 start ecosystem.config.js
```

4. **设置开机自启**

```bash
pm2 startup
pm2 save
```

### 🌐 Nginx 反向代理配置

如果使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 📊 部署方式对比

| 部署方式       | 优点                       | 缺点         | 适用场景           |
| -------------- | -------------------------- | ------------ | ------------------ |
| **Vercel**     | 零配置、自动扩展、CDN 加速 | 有使用限制   | 个人项目、小型应用 |
| **Docker**     | 环境一致、易于扩展、容器化 | 需要容器知识 | 企业级应用、微服务 |
| **传统服务器** | 完全控制、成本可控         | 需要运维知识 | 大型项目、定制需求 |

### 🔧 部署后优化

#### 性能优化

- 启用 gzip 压缩
- 配置 CDN 加速
- 使用 Redis 缓存
- 数据库连接池优化

#### 监控配置

- 设置应用监控
- 配置错误日志收集
- 性能指标监控
- 用户行为分析

#### 安全配置

- HTTPS 证书配置
- 安全头设置
- 防火墙配置
- 定期安全更新

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
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
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
