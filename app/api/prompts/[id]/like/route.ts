import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const promptId = id
    const userEmail = session.user.email

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 检查提示词是否存在
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    })

    if (!prompt) {
      return NextResponse.json({ error: '提示词不存在' }, { status: 404 })
    }

    // 检查用户是否已经点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: promptId
        }
      }
    })

    let liked = false
    let totalLikes = 0

    if (existingLike) {
      // 取消点赞
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id }
        }),
        prisma.prompt.update({
          where: { id: promptId },
          data: { likes: { decrement: 1 } }
        })
      ])
      liked = false
    } else {
      // 添加点赞
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: user.id,
            promptId: promptId
          }
        }),
        prisma.prompt.update({
          where: { id: promptId },
          data: { likes: { increment: 1 } }
        })
      ])
      liked = true
    }

    // 获取最新的点赞数
    const updatedPrompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { likes: true }
    })

    totalLikes = updatedPrompt?.likes || 0

    return NextResponse.json({
      success: true,
      liked,
      totalLikes
    })

  } catch (error) {
    console.error('点赞操作失败:', error)
    return NextResponse.json(
      { error: '操作失败，请重试' },
      { status: 500 }
    )
  }
}

// 获取点赞状态
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    const promptId = id

    // 获取提示词基本信息
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { likes: true }
    })

    if (!prompt) {
      return NextResponse.json({ error: '提示词不存在' }, { status: 404 })
    }

    let liked = false

    // 如果用户已登录，检查点赞状态
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        const existingLike = await prisma.like.findUnique({
          where: {
            userId_promptId: {
              userId: user.id,
              promptId: promptId
            }
          }
        })
        liked = !!existingLike
      }
    }

    return NextResponse.json({
      success: true,
      liked,
      totalLikes: prompt.likes
    })

  } catch (error) {
    console.error('获取点赞状态失败:', error)
    return NextResponse.json(
      { error: '获取失败，请重试' },
      { status: 500 }
    )
  }
}