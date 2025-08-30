import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - 获取平台统计数据
export async function GET() {
  try {
    // 并行查询所有统计数据以提高性能
    const [
      totalPrompts,
      totalUsers,
      totalLikes,
      recentPrompts
    ] = await Promise.all([
      // 总提示词数量
      prisma.prompt.count(),
      
      // 总用户数量
      prisma.user.count(),
      
      // 总点赞数量
      prisma.like.count(),
      
      // 最近7天创建的提示词数量
      prisma.prompt.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // 计算活跃用户数（最近30天有活动的用户）
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          {
            prompts: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          },
          {
            likes: {
              some: {}
            }
          }
        ]
      }
    })

    return NextResponse.json({
      totalPrompts,
      totalUsers,
      activeUsers,
      totalLikes,
      recentPrompts,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error("获取统计数据失败:", error)
    
    // 返回默认数据以防数据库查询失败
    return NextResponse.json({
      totalPrompts: 0,
      totalUsers: 0,
      activeUsers: 0,
      totalLikes: 0,
      recentPrompts: 0,
      lastUpdated: new Date().toISOString(),
      error: "数据获取失败，显示默认值"
    })
  }
}