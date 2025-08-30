# PromptHUB 部署指南

## 部署步骤

### 1. 环境准备

确保您有以下账户和服务：
- [Vercel](https://vercel.com) 账户
- [PostgreSQL](https://www.postgresql.org/) 数据库（推荐使用 [Supabase](https://supabase.com) 或 [PlanetScale](https://planetscale.com)）
- [GitHub OAuth App](https://github.com/settings/applications/new)

### 2. 环境变量配置

在Vercel项目设置中添加以下环境变量：

```bash
# 数据库连接
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth配置
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-random-secret-key"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# GitHub API Token (可选，用于提高API限制)
GITHUB_TOKEN="your-github-personal-access-token"
```

### 3. GitHub OAuth应用设置

1. 访问 [GitHub Developer Settings](https://github.com/settings/applications/new)
2. 创建新的OAuth应用
3. 设置回调URL: `https://your-domain.vercel.app/api/auth/callback/github`
4. 复制Client ID和Client Secret到环境变量

### 4. 数据库设置

#### 使用Supabase (推荐)

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 获取数据库连接字符串
3. 在项目设置中找到Database URL

#### 使用其他PostgreSQL服务

确保数据库支持以下特性：
- PostgreSQL 12+
- 支持外键约束
- 支持事务

### 5. 部署到Vercel

#### 方法1: 通过Vercel Dashboard

1. 登录Vercel Dashboard
2. 点击"New Project"
3. 导入您的GitHub仓库
4. 配置环境变量
5. 点击"Deploy"

#### 方法2: 通过Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel --prod
```

### 6. 数据库迁移

部署成功后，需要初始化数据库：

```bash
# 推送数据库模式
npx prisma db push

# (可选) 添加示例数据
npx prisma db seed
```

### 7. 验证部署

访问您的部署URL，检查以下功能：

- [ ] 用户登录/注册
- [ ] Profile编辑保存
- [ ] 账户设置保存
- [ ] 隐私设置保存
- [ ] 主页统计数据显示
- [ ] GitHub star数据获取
- [ ] 提示词卡片跳转

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查DATABASE_URL格式是否正确
   - 确保数据库服务正在运行
   - 验证网络连接权限

2. **GitHub OAuth失败**
   - 检查回调URL设置
   - 验证Client ID和Secret
   - 确保OAuth应用已激活

3. **API路由404错误**
   - 检查文件路径是否正确
   - 确保所有API文件都已部署
   - 验证Next.js版本兼容性

4. **统计数据不显示**
   - 检查数据库连接
   - 验证Prisma客户端配置
   - 查看服务器日志

### 调试命令

```bash
# 检查部署配置
node scripts/deploy-check.js

# 本地测试构建
npm run build

# 检查数据库连接
npx prisma db pull

# 查看数据库状态
npx prisma studio
```

## 性能优化

### 1. 数据库优化
- 为常用查询添加索引
- 使用连接池
- 实现查询缓存

### 2. API优化
- 实现响应缓存
- 使用CDN加速静态资源
- 优化数据库查询

### 3. 前端优化
- 启用Next.js图片优化
- 实现代码分割
- 使用服务端渲染

## 监控和维护

### 1. 错误监控
- 集成Sentry或类似服务
- 设置错误告警
- 定期检查日志

### 2. 性能监控
- 使用Vercel Analytics
- 监控API响应时间
- 跟踪用户体验指标

### 3. 数据备份
- 定期备份数据库
- 测试恢复流程
- 保持多个备份版本

## 支持

如果遇到问题，请：

1. 检查本文档的故障排除部分
2. 查看项目的GitHub Issues
3. 联系技术支持团队

---

**注意**: 请确保在生产环境中使用强密码和安全的环境变量配置。