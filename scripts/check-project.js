#!/usr/bin/env node

/**
 * 项目健康检查脚本
 * 检查项目的代码质量、依赖关系和配置完整性
 */

const fs = require("fs")
const path = require("path")

console.log("🔍 开始项目健康检查...\n")

// 检查必要的文件是否存在
const requiredFiles = [
  "package.json",
  "tsconfig.json",
  "tailwind.config.js",
  "next.config.mjs",
  ".env.example",
  "lib/auth.ts",
  "app/api/auth/[...nextauth]/route.ts",
  "components/session-provider.tsx",
  "components/auth-button.tsx",
  "types/next-auth.d.ts",
]

console.log("📁 检查必要文件...")
let missingFiles = []

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 缺失`)
    missingFiles.push(file)
  }
})

// 检查 package.json 依赖
console.log("\n📦 检查关键依赖...")
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const requiredDeps = {
  next: ">=13.0.0",
  react: ">=18.0.0",
  "next-auth": ">=4.0.0",
  typescript: ">=4.0.0",
}

Object.entries(requiredDeps).forEach(([dep, version]) => {
  const installed =
    packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
  if (installed) {
    console.log(`✅ ${dep}: ${installed}`)
  } else {
    console.log(`❌ ${dep} - 未安装`)
  }
})

// 检查环境变量模板
console.log("\n🔧 检查环境变量配置...")
if (fs.existsSync(".env.example")) {
  const envExample = fs.readFileSync(".env.example", "utf8")
  const requiredEnvVars = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "GITHUB_ID",
    "GITHUB_SECRET",
    "DATABASE_URL",
  ]

  requiredEnvVars.forEach((envVar) => {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar}`)
    } else {
      console.log(`❌ ${envVar} - 缺失`)
    }
  })
}

// 检查 TypeScript 配置
console.log("\n🔧 检查 TypeScript 配置...")
if (fs.existsSync("tsconfig.json")) {
  const tsConfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"))
  const requiredOptions = ["strict", "esModuleInterop"]

  requiredOptions.forEach((option) => {
    if (tsConfig.compilerOptions?.[option]) {
      console.log(`✅ ${option}: ${tsConfig.compilerOptions[option]}`)
    } else {
      console.log(`⚠️  ${option} - 建议启用`)
    }
  })
}

// 总结
console.log("\n📊 检查总结:")
if (missingFiles.length === 0) {
  console.log("🎉 所有必要文件都存在！")
} else {
  console.log(`⚠️  发现 ${missingFiles.length} 个缺失文件`)
}

console.log("\n✨ 项目健康检查完成！")
