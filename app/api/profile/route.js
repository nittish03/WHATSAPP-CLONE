import { NextResponse } from 'next/server'
import { prismaDB } from '@/lib/prismaDB'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/authOptions'
import { google } from 'googleapis'

// Google Drive setup (same as your upload route)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
})

const drive = google.drive({ version: "v3", auth })

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prismaDB.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, image, oldFileId } = await request.json()

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters long' }, { status: 400 })
    }

    // ✅ Delete old Google Drive file directly (no fetch call needed)
    if (oldFileId && image && oldFileId !== image) {
      try {
        await drive.files.delete({ fileId: oldFileId }).catch((err) => {
          console.error('Google Drive delete error:', err)
          // Don't fail the entire operation if delete fails
        })
      } catch (err) {
        console.error('Failed to delete old image:', err)
        // Continue anyway - don't fail the profile update
      }
    }

    const updatedUser = await prismaDB.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        image: image || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
