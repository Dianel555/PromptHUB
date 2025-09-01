// 数据同步检测和修复工具
export class DataSyncChecker {
  private static instance: DataSyncChecker
  
  public static getInstance(): DataSyncChecker {
    if (!DataSyncChecker.instance) {
      DataSyncChecker.instance = new DataSyncChecker()
    }
    return DataSyncChecker.instance
  }

  // 检查localStorage可用性
  public checkLocalStorageHealth(): boolean {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (error) {
      console.error('localStorage不可用:', error)
      return false
    }
  }

  // 检查数据完整性
  public checkDataIntegrity(): {
    isValid: boolean
    issues: string[]
    prompts: number
    stats: any
  } {
    const issues: string[] = []
    let prompts = 0
    let stats = null

    try {
      // 检查提示词数据
      const promptsData = localStorage.getItem('user_prompts')
      if (promptsData) {
        const parsed = JSON.parse(promptsData)
        if (Array.isArray(parsed)) {
          prompts = parsed.length
          
          // 检查每个提示词的数据结构
          parsed.forEach((prompt, index) => {
            if (!prompt.id || !prompt.title || !prompt.content) {
              issues.push(`提示词 ${index} 数据不完整`)
            }
            if (!prompt.author || !prompt.author.id) {
              issues.push(`提示词 ${index} 作者信息缺失`)
            }
          })
        } else {
          issues.push('提示词数据格式错误')
        }
      }

      // 检查统计数据
      const statsData = localStorage.getItem('user_stats')
      if (statsData) {
        stats = JSON.parse(statsData)
        if (typeof stats.totalPrompts !== 'number') {
          issues.push('统计数据格式错误')
        }
      }

    } catch (error) {
      issues.push(`数据解析错误: ${error}`)
    }

    return {
      isValid: issues.length === 0,
      issues,
      prompts,
      stats
    }
  }

  // 修复数据不一致问题
  public repairDataInconsistency(): boolean {
    try {
      const { getUserPrompts, updateUserStats } = require('./prompt-storage')
      
      // 重新计算统计数据
      updateUserStats()
      
      console.log('数据修复完成')
      return true
    } catch (error) {
      console.error('数据修复失败:', error)
      return false
    }
  }

  // 生成诊断报告
  public generateDiagnosticReport(): string {
    const timestamp = new Date().toISOString()
    const storageHealth = this.checkLocalStorageHealth()
    const dataIntegrity = this.checkDataIntegrity()
    
    return `
# 数据同步诊断报告
生成时间: ${timestamp}

## 存储系统状态
- localStorage可用性: ${storageHealth ? '✅ 正常' : '❌ 异常'}

## 数据完整性检查
- 数据有效性: ${dataIntegrity.isValid ? '✅ 正常' : '❌ 异常'}
- 提示词数量: ${dataIntegrity.prompts}
- 统计数据: ${dataIntegrity.stats ? '✅ 存在' : '❌ 缺失'}

## 发现的问题
${dataIntegrity.issues.length > 0 ? 
  dataIntegrity.issues.map(issue => `- ${issue}`).join('\n') : 
  '无问题发现'
}

## 建议操作
${!storageHealth ? '- 检查浏览器设置，确保允许本地存储\n' : ''}
${!dataIntegrity.isValid ? '- 运行数据修复程序\n' : ''}
${dataIntegrity.prompts === 0 ? '- 创建第一个提示词以测试系统\n' : ''}
    `.trim()
  }
}

// 导出单例实例
export const dataSyncChecker = DataSyncChecker.getInstance()