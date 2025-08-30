import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    // 模拟获取用户设置数据
    const settings = {
      displayName: session.user.name || "",
      email: session.user.email,
      bio: "这是一个简短的个人介绍...",
      website: "",
      location: "",
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("获取用户设置失败:", error)
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
      displayName,
      email,
      bio,
      website,
      location,
      emailNotifications,
      pushNotifications,
      marketingEmails,
    } = body

    // 基本验证
    if (displayName && displayName.length > 100) {
      return NextResponse.json({ error: "显示名称过长" }, { status: 400 })
    }

    if (bio && bio.length > 500) {
      return NextResponse.json({ error: "个人简介过长" }, { status: 400 })
    }

    // 在实际项目中，这里应该更新数据库
    // 现在我们模拟保存成功并存储到内存中（仅用于演示）
    console.log("保存用户设置:", {
      userEmail: session.user.email,
      settings: body,
      timestamp: new Date().toISOString(),
    })

    // 模拟保存延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "设置已成功保存",
      data: body,
    })
  } catch (error) {
    console.error("保存用户设置失败:", error)
    return NextResponse.json({ error: "保存失败，请重试" }, { status: 500 })
  }
}
