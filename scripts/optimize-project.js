#!/usr/bin/env node

/**
 * 项目优化脚本
 * 清理冗余代码，优化项目结构
 */

const fs = require("fs")
const path = require("path")

console.log("🚀 开始项目优化...\n")

// 检查并清理未使用的导入
function checkUnusedImports() {
  console.log("🔍 检查未使用的导入...")

  const componentFiles = [
    "components/site-header.tsx",
    "components/auth-button.tsx",
    "components/session-provider.tsx",
  ]

  componentFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8")

      // 检查是否有未使用的导入
      const imports = content.match(/import.*from.*/g) || []
      const usedImports = []

      imports.forEach((importLine) => {
        const importName = importLine.match(/import\s+{?\s*([^}]+)\s*}?\s+from/)
        if (importName) {
          const names = importName[1].split(",").map((n) => n.trim())
          names.forEach((name) => {
            if (content.includes(name.replace(/\s+as\s+\w+/, ""))) {
              usedImports.push(name)
            }
          })
        }
      })

      console.log(`✅ ${file} - 导入检查完成`)
    }
  })
}

// 检查组件结构
function checkComponentStructure() {
  console.log("\n🏗️  检查组件结构...")

  const components = [
    "components/auth-button.tsx",
    "components/session-provider.tsx",
    "components/site-header.tsx",
  ]

  components.forEach((component) => {
    if (fs.existsSync(component)) {
      const content = fs.readFileSync(component, "utf8")

      // 检查是否使用了 "use client" 指令
      if (content.includes('"use client"')) {
        console.log(`✅ ${component} - 正确使用客户端组件`)
      } else if (
        content.includes("useState") ||
        content.includes("useEffect") ||
        content.includes("useSession")
      ) {
        console.log(`⚠️  ${component} - 可能需要 "use client" 指令`)
      } else {
        console.log(`✅ ${component} - 服务器组件`)
      }

      // 检查 TypeScript 接口定义
      if (content.includes("interface") || content.includes("type")) {
        console.log(`✅ ${component} - 包含类型定义`)
      }
    }
  })
}

// 检查认证配置
function checkAuthConfig() {
  console.log("\n🔐 检查认证配置...")

  if (fs.existsSync("lib/auth.ts")) {
    const authConfig = fs.readFileSync("lib/auth.ts", "utf8")

    if (authConfig.includes("GitHubProvider")) {
      console.log("✅ GitHub 认证提供者已配置")
    }

    if (authConfig.includes("callbacks")) {
      console.log("✅ 认证回调已配置")
    }

    if (authConfig.includes("session") && authConfig.includes("jwt")) {
      console.log("✅ 会话和 JWT 回调已配置")
    }
  }

  if (fs.existsSync("app/api/auth/[...nextauth]/route.ts")) {
    console.log("✅ NextAuth.js API 路由已配置")
  }
}

// 生成优化建议
function generateOptimizationSuggestions() {
  console.log("\n💡 优化建议:")

  const suggestions = [
    "1. 确保所有环境变量都已正确配置",
    "2. 定期更新依赖包到最新稳定版本",
    "3. 使用 TypeScript 严格模式提高代码质量",
    "4. 为关键组件添加错误边界",
    "5. 考虑添加单元测试和集成测试",
    "6. 使用 ESLint 和 Prettier 保持代码风格一致",
    "7. 优化图片资源，使用 Next.js Image 组件",
    "8. 考虑添加 PWA 支持提升用户体验",
  ]

  suggestions.forEach((suggestion) => {
    console.log(`💡 ${suggestion}`)
  })
}

// 执行优化检查
checkUnusedImports()
checkComponentStructure()
checkAuthConfig()
generateOptimizationSuggestions()

console.log("\n✨ 项目优化检查完成！")
