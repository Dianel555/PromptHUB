import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    // 模拟获取用户隐私设置数据
    const privacySettings = {
      profileVisibility: "public",
      showEmail: false,
      showActivity: true,
      allowMessages: true,
      dataCollection: false,
      analyticsTracking: true,
      thirdPartySharing: false,
    }

    return NextResponse.json(privacySettings)
  } catch (error) {
    console.error("获取隐私设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()

    // 验证输入数据
    const {
      profileVisibility,
      showEmail,
      showActivity,
      allowMessages,
      dataCollection,
      analyticsTracking,
      thirdPartySharing,
    } = body

    // 验证profileVisibility值
    const validVisibilityOptions = ["public", "friends", "private"]
    if (profileVisibility && !validVisibilityOptions.includes(profileVisibility)) {
      return NextResponse.json({ error: "无效的可见性选项" }, { status: 400 })
    }

    // 在实际项目中，这里应该更新数据库
    // 现在我们模拟保存成功并存储到内存中（仅用于演示）
    console.log("保存隐私设置:", {
      userEmail: session.user.email,
      settings: body,
      timestamp: new Date().toISOString(),
    })

    // 模拟保存延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "隐私设置已成功保存",
      data: body,
    })
  } catch (error) {
    console.error("保存隐私设置失败:", error)
    return NextResponse.json({ error: "保存失败，请重试" }, { status: 500 })
  }
}
