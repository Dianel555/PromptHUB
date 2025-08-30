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
      select: { privacy: true }
    })

    const defaultPrivacy = {
      profileVisibility: "public",
      showEmail: false,
      showStats: true,
      allowMessages: true,
    }

    const privacy = user?.privacy ? 
      { ...defaultPrivacy, ...(user.privacy as object) } : 
      defaultPrivacy

    return NextResponse.json(privacy)
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

    const privacy = await request.json()

    await prisma.user.upsert({
      where: { email: session.user.email },
      update: { privacy },
      create: {
        email: session.user.email,
        name: session.user.name || "",
        image: session.user.image || "",
        privacy
      }
    })

    return NextResponse.json({ message: "隐私设置保存成功", privacy })
  } catch (error) {
    console.error("保存隐私设置失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}