import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 并行查询提升性能
    const [totalPrompts, totalUsers] = await Promise.all([
      // 查询已发布的提示词总数
      prisma.prompt.count({
        where: {
          isPublic: true
        }
      }),
      // 查询活跃用户总数
      prisma.user.count()
    ])

    const stats = {
      totalPrompts,
      totalUsers,
      lastUpdated: new Date().toISOString()
    }

    // 设置缓存头 - 缓存5分钟
    const response = NextResponse.json(stats)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Platform stats fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch platform stats',
      totalPrompts: 0,
      totalUsers: 0,
      lastUpdated: new Date().toISOString()
    }, { status: 500 })
  }
}