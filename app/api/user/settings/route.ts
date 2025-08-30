import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - 获取用户设置
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    // 获取用户设置，如果不存在则返回默认值
    let userSettings = await prisma.userSettings.findUnique({
      where: { userEmail: session.user.email }
    })

    if (!userSettings) {
      // 创建默认设置
      userSettings = await prisma.userSettings.create({
        data: {
          userEmail: session.user.email,
          emailNotifications: true,
          publicProfile: true,
          showActivity: true,
          allowComments: true,
        }
      })
    }

    return NextResponse.json({
      emailNotifications: userSettings.emailNotifications,
      publicProfile: userSettings.publicProfile,
      showActivity: userSettings.showActivity,
      allowComments: userSettings.allowComments,
    })
  } catch (error) {
    console.error("获取用户设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

// PUT - 更新用户设置
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const { emailNotifications, publicProfile, showActivity, allowComments } = body

    // 更新或创建用户设置
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userEmail: session.user.email },
      update: {
        emailNotifications: emailNotifications ?? true,
        publicProfile: publicProfile ?? true,
        showActivity: showActivity ?? true,
        allowComments: allowComments ?? true,
        updatedAt: new Date(),
      },
      create: {
        userEmail: session.user.email,
        emailNotifications: emailNotifications ?? true,
        publicProfile: publicProfile ?? true,
        showActivity: showActivity ?? true,
        allowComments: allowComments ?? true,
      }
    })

    return NextResponse.json({
      message: "设置更新成功",
      settings: {
        emailNotifications: updatedSettings.emailNotifications,
        publicProfile: updatedSettings.publicProfile,
        showActivity: updatedSettings.showActivity,
        allowComments: updatedSettings.allowComments,
      }
    })
  } catch (error) {
    console.error("更新用户设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}