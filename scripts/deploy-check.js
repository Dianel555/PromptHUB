#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 检查部署配置...\n')

// 检查必要的文件
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'prisma/schema.prisma',
  '.env.example'
]

let hasErrors = false

console.log('📁 检查必要文件:')
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 文件缺失`)
    hasErrors = true
  }
})

// 检查环境变量
console.log('\n🔐 检查环境变量配置:')
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
]

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}`)
  } else {
    console.log(`⚠️  ${envVar} - 未设置（请在Vercel中配置）`)
  }
})

// 检查package.json脚本
console.log('\n📦 检查package.json脚本:')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const requiredScripts = ['build', 'start', 'dev']

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`)
  } else {
    console.log(`❌ ${script} - 脚本缺失`)
    hasErrors = true
  }
})

// 检查关键依赖
console.log('\n📚 检查关键依赖:')
const requiredDeps = [
  'next',
  'react',
  'next-auth',
  '@prisma/client',
  'prisma'
]

const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }

requiredDeps.forEach(dep => {
  if (allDeps[dep]) {
    console.log(`✅ ${dep}: ${allDeps[dep]}`)
  } else {
    console.log(`❌ ${dep} - 依赖缺失`)
    hasErrors = true
  }
})

// 检查API路由
console.log('\n🛣️  检查API路由:')
const apiRoutes = [
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/user/route.ts',
  'app/api/user/settings/route.ts',
  'app/api/user/privacy/route.ts',
  'app/api/stats/route.ts',
  'app/api/github/stats/route.ts'
]

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`)
  } else {
    console.log(`⚠️  ${route} - API路由缺失`)
  }
})

// 总结
console.log('\n📋 部署检查总结:')
if (hasErrors) {
  console.log('❌ 发现问题，请修复后再部署')
  process.exit(1)
} else {
  console.log('✅ 所有检查通过，可以部署')
}

console.log('\n🚀 部署建议:')
console.log('1. 确保在Vercel中设置了所有必要的环境变量')
console.log('2. 确保数据库已正确配置并可访问')
console.log('3. 运行 `npm run build` 确保构建成功')
console.log('4. 部署后运行数据库迁移: `npx prisma db push`')
console.log('5. 可选：运行种子数据: `npx prisma db seed`')