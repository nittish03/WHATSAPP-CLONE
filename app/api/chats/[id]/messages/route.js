import { NextResponse } from 'next/server'
import { prismaDB } from '@/lib/prismaDB'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/authOptions'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { id } = resolvedParams

    // Verify user is participant of this chat
    const participant = await prismaDB.chatParticipant.findFirst({
      where: {
        chatId: id,
        userId: session.user.id
      }
    })

    if (!participant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const messages = await prismaDB.message.findMany({
      where: { chatId: id },
      include: {
        sender: {
          select: { id: true, name: true, image: true }
        },
        readBy: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { id } = resolvedParams
    const { content, type = 'text', fileUrl } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Verify user is participant of this chat
    const participant = await prismaDB.chatParticipant.findFirst({
      where: {
        chatId: id,
        userId: session.user.id
      }
    })

    if (!participant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create message and update chat in a transaction
    const [message] = await prismaDB.$transaction([
      prismaDB.message.create({
        data: {
          content: content.trim(),
          type,
          fileUrl,
          chatId: id,
          senderId: session.user.id
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true }
          }
        }
      }),
      prismaDB.chat.update({
        where: { id },
        data: {
          lastMessage: content.trim(),
          lastMessageAt: new Date()
        }
      })
    ])

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
