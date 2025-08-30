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
      totalComments,
      recentPrompts,
      topTags
    ] = await Promise.all([
      // 总提示词数量
      prisma.prompt.count({
        where: { isPublic: true }
      }),
      
      // 总用户数量
      prisma.user.count(),
      
      // 总点赞数量
      prisma.like.count(),
      
      // 总评论数量
      prisma.comment.count(),
      
      // 最近7天创建的提示词数量
      prisma.prompt.count({
        where: {
          isPublic: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // 热门标签（前10个）
      prisma.tag.findMany({
        take: 10,
        orderBy: {
          prompts: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: {
              prompts: true
            }
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
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          },
          {
            comments: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
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
      totalComments,
      recentPrompts,
      topTags: topTags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        count: tag._count.prompts
      })),
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
      totalComments: 0,
      recentPrompts: 0,
      topTags: [],
      lastUpdated: new Date().toISOString(),
      error: "数据获取失败，显示默认值"
    })
  }
}