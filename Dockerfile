# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine AS base

# 安装依赖项所需的包
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖项
COPY package*.json ./
RUN npm ci --only=production

# 构建应用程序
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1

# 构建Next.js应用
RUN npm run build

# 生产镜像，复制所有文件并运行next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置正确的权限
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 启动应用
CMD ["node", "server.js"]