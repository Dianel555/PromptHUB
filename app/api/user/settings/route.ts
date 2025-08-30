import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { settings: true }
    })

    const defaultSettings = {
      emailNotifications: true,
      publicProfile: true,
      showActivity: true,
      allowComments: true,
    }

    const settings = user?.settings ? 
      { ...defaultSettings, ...(user.settings as object) } : 
      defaultSettings

    return NextResponse.json(settings)
  } catch (error) {
    console.error("获取设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const settings = await request.json()

    await prisma.user.upsert({
      where: { email: session.user.email },
      update: { settings },
      create: {
        email: session.user.email,
        name: session.user.name || "",
        image: session.user.image || "",
        settings
      }
    })

    return NextResponse.json({ message: "设置保存成功", settings })
  } catch (error) {
    console.error("保存设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}