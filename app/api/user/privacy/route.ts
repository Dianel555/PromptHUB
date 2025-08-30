import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { privacy: true }
    })

    return NextResponse.json(user?.privacy || {})
  } catch (error) {
    console.error('Privacy fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch privacy settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const privacy = await request.json()
    
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { privacy: privacy },
      select: { privacy: true }
    })

    return NextResponse.json(updatedUser.privacy)
  } catch (error) {
    console.error('Privacy update error:', error)
    return NextResponse.json({ error: 'Failed to update privacy settings' }, { status: 500 })
  }
}