import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// 由于Prisma客户端可能未安装，我们先使用模拟数据
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    // 模拟从数据库获取的用户统计数据
    // 在实际项目中，这里应该从数据库查询真实数据
    const stats = {
      totalLikes: Math.floor(Math.random() * 200) + 50, // 50-250之间的随机数
      totalViews: Math.floor(Math.random() * 3000) + 1000, // 1000-4000之间的随机数
      totalPrompts: Math.floor(Math.random() * 20) + 5, // 5-25之间的随机数
      joinDate: "2024-01-15", // 可以从session或数据库获取真实注册时间
      favoritePrompts: Math.floor(Math.random() * 50) + 10, // 10-60之间的随机数
      followers: Math.floor(Math.random() * 100) + 20, // 20-120之间的随机数
      following: Math.floor(Math.random() * 50) + 10, // 10-60之间的随机数
      achievements: calculateAchievements(100, 10, 50),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("获取用户统计数据失败:", error)
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    )
  }
}

function calculateAchievements(likes: number, prompts: number, followers: number): string[] {
  const achievements: string[] = []
  
  if (prompts >= 10) achievements.push("创作达人")
  if (likes >= 100) achievements.push("人气作者")
  if (followers >= 50) achievements.push("社区明星")
  if (prompts >= 1) achievements.push("活跃用户")
  
  return achievements
}