import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const privacySchema = z.object({
  profileVisibility: z.boolean().optional(),
  promptsVisibility: z.boolean().optional(),
  activityVisibility: z.boolean().optional(),
  searchable: z.boolean().optional(),
  allowDirectMessages: z.boolean().optional(),
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

    // 返回默认隐私设置，直到数据库模式同步
    const defaultPrivacy = {
      profileVisibility: true,
      promptsVisibility: true,
      activityVisibility: true,
      searchable: true,
      allowDirectMessages: true,
    }

    return NextResponse.json(defaultPrivacy)

  } catch (error) {
    console.error("获取隐私设置失败:", error)
    return NextResponse.json(
      { error: "获取隐私设置失败" },
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
    const validatedData = privacySchema.parse(body)

    // 暂时返回默认隐私设置（直到数据库模式同步）
    // TODO: 在数据库模式同步后启用真实的隐私设置存储
    
    // 返回默认隐私设置，直到数据库模式同步
    const defaultPrivacy = {
      profileVisibility: validatedData.profileVisibility ?? true,
      promptsVisibility: validatedData.promptsVisibility ?? true,
      activityVisibility: validatedData.activityVisibility ?? true,
      searchable: validatedData.searchable ?? true,
      allowDirectMessages: validatedData.allowDirectMessages ?? true,
    }

    return NextResponse.json(defaultPrivacy)

  } catch (error) {
    console.error("更新隐私设置失败:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "更新隐私设置失败" },
      { status: 500 }
    )
  }
}