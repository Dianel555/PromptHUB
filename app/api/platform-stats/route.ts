import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // 获取查询参数中的本地统计数据
    const url = new URL(request.url)
    const localPromptsParam = url.searchParams.get('localPrompts')
    const localViewsParam = url.searchParams.get('localViews')
    const localLikesParam = url.searchParams.get('localLikes')
    
    const localStats = {
      totalPrompts: localPromptsParam ? parseInt(localPromptsParam) : 0,
      totalViews: localViewsParam ? parseInt(localViewsParam) : 0,
      totalLikes: localLikesParam ? parseInt(localLikesParam) : 0
    }

    // 并行查询提升性能
    const [totalPromptsDB, totalUsers, totalLikes, totalViews] = await Promise.all([
      // 查询已发布的提示词总数
      prisma.prompt.count({
        where: {
          isPublic: true
        }
      }),
      // 查询活跃用户总数
      prisma.user.count(),
      // 查询总点赞数
      prisma.like.count(),
      // 查询总浏览量
      prisma.prompt.aggregate({
        _sum: {
          views: true
        }
      })
    ])

    // 获取最近7天的提示词数量
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentPromptsDB = await prisma.prompt.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        },
        isPublic: true
      }
    })

    // 获取最近30天活跃用户数量
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activeUsers = await prisma.user.count({
      where: {
        prompts: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        }
      }
    })

    // 合并数据库统计和本地存储统计
    const stats = {
      totalPrompts: totalPromptsDB + localStats.totalPrompts,
      totalViews: (totalViews._sum.views || 0) + localStats.totalViews,
      totalLikes: totalLikes + localStats.totalLikes,
      totalCollections: 0, // 暂时设为0，等收藏功能实现后再统计
      totalUsers,
      activeUsers,
      recentPrompts: recentPromptsDB,
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
      totalViews: 0,
      totalLikes: 0,
      totalCollections: 0,
      totalUsers: 0,
      activeUsers: 0,
      recentPrompts: 0,
      lastUpdated: new Date().toISOString()
    }, { status: 500 })
  }
}

// 新增POST方法，允许前端上报本地统计数据
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { localStats } = body

    // 获取数据库统计数据
    const [totalPromptsDB, totalUsers, totalLikes, totalViews] = await Promise.all([
      prisma.prompt.count({
        where: {
          isPublic: true
        }
      }),
      prisma.user.count(),
      prisma.like.count(),
      prisma.prompt.aggregate({
        _sum: {
          views: true
        }
      })
    ])

    // 获取最近统计
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentPromptsDB = await prisma.prompt.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        },
        isPublic: true
      }
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activeUsers = await prisma.user.count({
      where: {
        prompts: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        }
      }
    })

    // 合并数据库统计和本地统计
    const combinedStats = {
      totalPrompts: totalPromptsDB + (localStats?.totalPrompts || 0),
      totalViews: (totalViews._sum.views || 0) + (localStats?.totalViews || 0),
      totalLikes: totalLikes + (localStats?.totalLikes || 0),
      totalCollections: 0,
      totalUsers,
      activeUsers,
      recentPrompts: recentPromptsDB + (localStats?.recentPrompts || 0),
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(combinedStats)
  } catch (error) {
    console.error('Platform stats update error:', error)
    return NextResponse.json({ error: 'Failed to update platform stats' }, { status: 500 })
  }
}