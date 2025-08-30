#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 开始 Vercel 构建...');

try {
  // 1. 生成 Prisma 客户端
  console.log('📦 生成 Prisma 客户端...');
  execSync('prisma generate', { stdio: 'inherit' });

  // 2. 尝试迁移部署
  console.log('🗄️ 尝试迁移部署...');
  try {
    execSync('prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ 迁移部署成功');
  } catch (migrateError) {
    console.log('⚠️ 迁移部署失败，使用 db push 作为备用方案...');
    execSync('prisma db push', { stdio: 'inherit' });
    console.log('✅ db push 成功');
  }

  // 3. 构建 Next.js 应用
  console.log('🏗️ 构建 Next.js 应用...');
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ 构建完成');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}