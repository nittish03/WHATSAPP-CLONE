import { NextResponse } from 'next/server'
import { prismaDB } from '@/lib/prismaDB'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/authOptions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const chats = await prismaDB.chat.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { name: true }
            }
          }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    })

    return NextResponse.json(chats)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { participantIds, isGroup, name } = await request.json()

    // Create chat
    const chat = await prismaDB.chat.create({
      data: {
        name: isGroup ? name : null,
        isGroup,
        createdBy: session.user.id,
        participants: {
          create: [
            { userId: session.user.id, role: isGroup ? 'admin' : 'member' },
            ...participantIds.map(id => ({ userId: id, role: 'member' }))
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      }
    })

    return NextResponse.json(chat)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
