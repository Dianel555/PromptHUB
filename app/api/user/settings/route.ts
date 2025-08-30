import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const settingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  publicProfile: z.boolean().optional(),
  showActivity: z.boolean().optional(),
  allowComments: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    // 返回默认设置，直到数据库模式同步
    const defaultSettings = {
      emailNotifications: true,
      publicProfile: true,
      showActivity: true,
      allowComments: true,
    }

    return NextResponse.json(defaultSettings)

  } catch (error) {
    console.error("获取用户设置失败:", error)
    return NextResponse.json(
      { error: "获取设置失败" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    // 暂时返回默认设置（直到数据库模式同步）
    // TODO: 在数据库模式同步后启用真实的设置存储
    
    // 返回默认设置，直到数据库模式同步
    const defaultSettings = {
      emailNotifications: validatedData.emailNotifications ?? true,
      publicProfile: validatedData.publicProfile ?? true,
      showActivity: validatedData.showActivity ?? true,
      allowComments: validatedData.allowComments ?? true,
    }

    return NextResponse.json(defaultSettings)

  } catch (error) {
    console.error("更新用户设置失败:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "更新设置失败" },
      { status: 500 }
    )
  }
}