// API诊断工具 - 生成完整的API状态报告
export class ApiDiagnostics {
  private static instance: ApiDiagnostics
  
  public static getInstance(): ApiDiagnostics {
    if (!ApiDiagnostics.instance) {
      ApiDiagnostics.instance = new ApiDiagnostics()
    }
    return ApiDiagnostics.instance
  }

  // 测试单个API端点
  private async testApiEndpoint(url: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<{
    url: string
    status: 'success' | 'error' | 'timeout'
    statusCode?: number
    responseTime: number
    data?: any
    error?: string
  }> {
    const startTime = Date.now()
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        const data = await response.json()
        return {
          url,
          status: 'success',
          statusCode: response.status,
          responseTime,
          data
        }
      } else {
        return {
          url,
          status: 'error',
          statusCode: response.status,
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime
      
      if (error.name === 'AbortError') {
        return {
          url,
          status: 'timeout',
          responseTime,
          error: '请求超时'
        }
      }
      
      return {
        url,
        status: 'error',
        responseTime,
        error: error.message || '未知错误'
      }
    }
  }

  // 生成完整的API状态报告
  public async generateApiStatusReport(): Promise<string> {
    const timestamp = new Date().toISOString()
    const results = []

    console.log('开始API诊断...')

    // 测试三个主要的统计API
    const apiEndpoints = [
      { url: '/api/stats', name: '用户基础统计API' },
      { url: '/api/user/stats', name: '用户详细统计API' },
      { url: '/api/platform-stats', name: '平台统计API' }
    ]

    for (const endpoint of apiEndpoints) {
      console.log(`测试 ${endpoint.name}...`)
      const result = await this.testApiEndpoint(endpoint.url)
      results.push({ ...result, name: endpoint.name })
    }

    // 测试平台统计的POST方法
    console.log('测试平台统计数据上报...')
    const postResult = await this.testApiEndpoint('/api/platform-stats', 'POST', {
      localStats: {
        totalPrompts: 5,
        totalViews: 100,
        totalLikes: 20
      }
    })
    results.push({ ...postResult, name: '平台统计数据上报API' })

    // 生成报告
    let report = `# API状态诊断报告\n\n`
    report += `**生成时间:** ${timestamp}\n\n`
    report += `## 测试概览\n\n`
    
    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length
    const timeoutCount = results.filter(r => r.status === 'timeout').length
    
    report += `- 总测试数: ${results.length}\n`
    report += `- 成功: ${successCount} ✅\n`
    report += `- 失败: ${errorCount} ❌\n`
    report += `- 超时: ${timeoutCount} ⏰\n\n`

    report += `## 详细结果\n\n`

    results.forEach((result, index) => {
      const statusIcon = result.status === 'success' ? '✅' : 
                        result.status === 'timeout' ? '⏰' : '❌'
      
      report += `### ${index + 1}. ${result.name} ${statusIcon}\n\n`
      report += `- **URL:** ${result.url}\n`
      report += `- **状态:** ${result.status}\n`
      report += `- **响应时间:** ${result.responseTime}ms\n`
      
      if (result.statusCode) {
        report += `- **HTTP状态码:** ${result.statusCode}\n`
      }
      
      if (result.error) {
        report += `- **错误信息:** ${result.error}\n`
      }
      
      if (result.data && result.status === 'success') {
        report += `- **返回数据结构:**\n`
        const dataKeys = Object.keys(result.data)
        dataKeys.forEach(key => {
          const value = result.data[key]
          const type = typeof value
          report += `  - ${key}: ${type} ${type === 'number' ? `(${value})` : ''}\n`
        })
      }
      
      report += `\n`
    })

    // 数据一致性分析
    report += `## 数据一致性分析\n\n`
    
    const successResults = results.filter(r => r.status === 'success' && r.data)
    if (successResults.length >= 2) {
      report += `### 统计数据对比\n\n`
      
      successResults.forEach(result => {
        if (result.data) {
          report += `**${result.name}:**\n`
          if (result.data.totalPrompts !== undefined) {
            report += `- 总提示词数: ${result.data.totalPrompts}\n`
          }
          if (result.data.totalLikes !== undefined) {
            report += `- 总点赞数: ${result.data.totalLikes}\n`
          }
          if (result.data.totalViews !== undefined) {
            report += `- 总浏览量: ${result.data.totalViews}\n`
          }
          report += `\n`
        }
      })
    } else {
      report += `无法进行数据一致性分析，成功的API调用不足。\n\n`
    }

    // 问题诊断和建议
    report += `## 问题诊断和建议\n\n`
    
    if (errorCount > 0) {
      report += `### 🔍 发现的问题\n\n`
      results.filter(r => r.status === 'error').forEach(result => {
        report += `- **${result.name}**: ${result.error}\n`
      })
      report += `\n`
    }
    
    if (timeoutCount > 0) {
      report += `### ⏰ 超时问题\n\n`
      results.filter(r => r.status === 'timeout').forEach(result => {
        report += `- **${result.name}**: 请求超时，可能是服务器响应慢或网络问题\n`
      })
      report += `\n`
    }

    report += `### 💡 优化建议\n\n`
    
    if (successCount === results.length) {
      report += `- 所有API运行正常 ✅\n`
      report += `- 建议定期监控API性能\n`
    } else {
      report += `- 修复失败的API端点\n`
      report += `- 添加API错误处理和重试机制\n`
      report += `- 实现API降级策略\n`
    }
    
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
    if (avgResponseTime > 1000) {
      report += `- 平均响应时间较慢 (${avgResponseTime.toFixed(0)}ms)，建议优化性能\n`
    }

    return report
  }

  // 检查数据闪退问题
  public async diagnoseDataFlashing(): Promise<{
    hasFlashingIssue: boolean
    possibleCauses: string[]
    recommendations: string[]
  }> {
    const possibleCauses: string[] = []
    const recommendations: string[] = []

    // 检查API响应时间差异
    const results = []
    for (let i = 0; i < 3; i++) {
      const result = await this.testApiEndpoint('/api/user/stats')
      results.push(result)
      await new Promise(resolve => setTimeout(resolve, 100)) // 间隔100ms
    }

    const responseTimes = results.map(r => r.responseTime)
    const maxTime = Math.max(...responseTimes)
    const minTime = Math.min(...responseTimes)
    
    if (maxTime - minTime > 500) {
      possibleCauses.push('API响应时间不稳定')
      recommendations.push('优化API性能，添加缓存机制')
    }

    // 检查数据一致性
    const successResults = results.filter(r => r.status === 'success')
    if (successResults.length > 1) {
      const firstData = successResults[0].data
      const hasInconsistentData = successResults.some(r => 
        JSON.stringify(r.data) !== JSON.stringify(firstData)
      )
      
      if (hasInconsistentData) {
        possibleCauses.push('多次请求返回不同数据')
        recommendations.push('检查数据库事务和缓存一致性')
      }
    }

    return {
      hasFlashingIssue: possibleCauses.length > 0,
      possibleCauses,
      recommendations
    }
  }
}

// 导出单例实例
export const apiDiagnostics = ApiDiagnostics.getInstance()