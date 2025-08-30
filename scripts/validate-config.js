#!/usr/bin/env node

/**
 * 配置一致性验证脚本
 * 确保所有脚本和文档中的文件引用都是一致的
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 验证配置文件一致性...\n')

// 检查实际存在的配置文件
const configFiles = [
  'next.config.js',
  'next.config.mjs',
  'next.config.ts'
]

let actualConfigFile = null
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    actualConfigFile = file
    console.log(`✅ 找到配置文件: ${file}`)
  }
})

if (!actualConfigFile) {
  console.log('❌ 未找到Next.js配置文件')
  process.exit(1)
}

// 检查脚本文件中的引用
const scriptsToCheck = [
  'scripts/check-project.js',
  'scripts/deploy-check.js'
]

let hasInconsistency = false

console.log('\n📋 检查脚本文件中的引用:')
scriptsToCheck.forEach(scriptFile => {
  if (fs.existsSync(scriptFile)) {
    const content = fs.readFileSync(scriptFile, 'utf8')
    
    // 检查是否引用了正确的配置文件
    if (content.includes(actualConfigFile)) {
      console.log(`✅ ${scriptFile} - 引用正确 (${actualConfigFile})`)
    } else {
      // 检查是否引用了错误的配置文件
      const wrongRefs = configFiles.filter(f => f !== actualConfigFile && content.includes(f))
      if (wrongRefs.length > 0) {
        console.log(`❌ ${scriptFile} - 引用错误: ${wrongRefs.join(', ')}，应该是 ${actualConfigFile}`)
        hasInconsistency = true
      } else {
        console.log(`⚠️  ${scriptFile} - 未找到配置文件引用`)
      }
    }
  } else {
    console.log(`⚠️  ${scriptFile} - 文件不存在`)
  }
})

// 检查文档文件
const docsToCheck = [
  'README.md',
  'DEPLOYMENT.md'
]

console.log('\n📚 检查文档文件中的引用:')
docsToCheck.forEach(docFile => {
  if (fs.existsSync(docFile)) {
    const content = fs.readFileSync(docFile, 'utf8')
    
    // 检查是否有配置文件的引用
    const hasConfigRef = configFiles.some(f => content.includes(f))
    if (hasConfigRef) {
      if (content.includes(actualConfigFile)) {
        console.log(`✅ ${docFile} - 引用正确`)
      } else {
        const wrongRefs = configFiles.filter(f => f !== actualConfigFile && content.includes(f))
        if (wrongRefs.length > 0) {
          console.log(`❌ ${docFile} - 引用错误: ${wrongRefs.join(', ')}`)
          hasInconsistency = true
        }
      }
    } else {
      console.log(`ℹ️  ${docFile} - 无配置文件引用`)
    }
  } else {
    console.log(`⚠️  ${docFile} - 文件不存在`)
  }
})

// 总结
console.log('\n📊 验证结果:')
if (hasInconsistency) {
  console.log('❌ 发现配置不一致，请修复')
  process.exit(1)
} else {
  console.log('✅ 所有配置引用都是一致的')
}

console.log(`\n✨ 当前使用的配置文件: ${actualConfigFile}`)