import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - 获取隐私设置
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    // 获取隐私设置，如果不存在则返回默认值
    let privacySettings = await prisma.privacySettings.findUnique({
      where: { userEmail: session.user.email }
    })

    if (!privacySettings) {
      // 创建默认隐私设置
      privacySettings = await prisma.privacySettings.create({
        data: {
          userEmail: session.user.email,
          profileVisibility: true,
          promptsVisibility: true,
          activityVisibility: true,
          searchable: true,
          allowDirectMessages: true,
        }
      })
    }

    return NextResponse.json({
      profileVisibility: privacySettings.profileVisibility,
      promptsVisibility: privacySettings.promptsVisibility,
      activityVisibility: privacySettings.activityVisibility,
      searchable: privacySettings.searchable,
      allowDirectMessages: privacySettings.allowDirectMessages,
    })
  } catch (error) {
    console.error("获取隐私设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

// PUT - 更新隐私设置
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      profileVisibility, 
      promptsVisibility, 
      activityVisibility, 
      searchable, 
      allowDirectMessages 
    } = body

    // 更新或创建隐私设置
    const updatedSettings = await prisma.privacySettings.upsert({
      where: { userEmail: session.user.email },
      update: {
        profileVisibility: profileVisibility ?? true,
        promptsVisibility: promptsVisibility ?? true,
        activityVisibility: activityVisibility ?? true,
        searchable: searchable ?? true,
        allowDirectMessages: allowDirectMessages ?? true,
        updatedAt: new Date(),
      },
      create: {
        userEmail: session.user.email,
        profileVisibility: profileVisibility ?? true,
        promptsVisibility: promptsVisibility ?? true,
        activityVisibility: activityVisibility ?? true,
        searchable: searchable ?? true,
        allowDirectMessages: allowDirectMessages ?? true,
      }
    })

    return NextResponse.json({
      message: "隐私设置更新成功",
      settings: {
        profileVisibility: updatedSettings.profileVisibility,
        promptsVisibility: updatedSettings.promptsVisibility,
        activityVisibility: updatedSettings.activityVisibility,
        searchable: updatedSettings.searchable,
        allowDirectMessages: updatedSettings.allowDirectMessages,
      }
    })
  } catch (error) {
    console.error("更新隐私设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}