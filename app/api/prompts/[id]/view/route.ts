import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const promptId = id

    // 检查提示词是否存在
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    })

    if (!prompt) {
      return NextResponse.json({ error: '提示词不存在' }, { status: 404 })
    }

    // 增加浏览量
    const updatedPrompt = await prisma.prompt.update({
      where: { id: promptId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      totalViews: updatedPrompt.views
    })

  } catch (error) {
    console.error('更新浏览量失败:', error)
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    )
  }
}

// 获取浏览量
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const promptId = id

    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { views: true }
    })

    if (!prompt) {
      return NextResponse.json({ error: '提示词不存在' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      totalViews: prompt.views
    })

  } catch (error) {
    console.error('获取浏览量失败:', error)
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    )
  }
}