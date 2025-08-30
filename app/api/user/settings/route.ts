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

    // 在实际项目中，这里应该更新数据库
    // 现在我们只是模拟保存成功
    console.log("保存用户设置:", body)

    // 模拟保存延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "设置已成功保存",
    })
  } catch (error) {
    console.error("保存用户设置失败:", error)
    return NextResponse.json({ error: "保存失败，请重试" }, { status: 500 })
  }
}
