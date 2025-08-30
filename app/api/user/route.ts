import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - 获取用户信息
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    // 从数据库获取用户信息
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        website: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // 如果用户不存在，创建新用户
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || "",
          image: session.user.image || "",
          bio: "",
          website: "",
          location: "",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          website: true,
          location: true,
          createdAt: true,
          updatedAt: true,
        }
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("获取用户信息失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

// PUT - 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, website, location } = body

    // 验证输入数据
    if (name && name.length > 50) {
      return NextResponse.json({ error: "姓名长度不能超过50个字符" }, { status: 400 })
    }
    
    if (bio && bio.length > 500) {
      return NextResponse.json({ error: "个人简介长度不能超过500个字符" }, { status: 400 })
    }

    if (website && !isValidUrl(website)) {
      return NextResponse.json({ error: "请输入有效的网站URL" }, { status: 400 })
    }

    // 更新用户信息
    const updatedUser = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        name: name || "",
        bio: bio || "",
        website: website || "",
        location: location || "",
        updatedAt: new Date(),
      },
      create: {
        email: session.user.email,
        name: name || session.user.name || "",
        image: session.user.image || "",
        bio: bio || "",
        website: website || "",
        location: location || "",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        website: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      message: "用户信息更新成功",
      user: updatedUser
    })
  } catch (error) {
    console.error("更新用户信息失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

// 验证URL格式
function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}