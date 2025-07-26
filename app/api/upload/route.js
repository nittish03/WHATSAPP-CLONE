import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/authOptions'
import { google } from 'googleapis'
import { Readable } from 'stream'

if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error("Missing Google Drive API credentials")
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
})

const drive = google.drive({ version: "v3", auth })

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File size too large. Maximum 5MB allowed.' 
      }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const stream = Readable.from(buffer)

    const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID
    if (!FOLDER_ID) {
      throw new Error("Missing Google Drive Folder ID")
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `profile_${session.user.id}_${timestamp}.${file.type.split('/')[1]}`

    // Upload to Google Drive
    const uploadResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: "id, webViewLink, webContentLink",
    })

    const fileId = uploadResponse.data.id

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    })

    // Generate direct image URL
    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`

    return NextResponse.json({ imageUrl, fileId })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file' 
    }, { status: 500 })
  }
}

// Delete old profile pictures
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    // Delete from Google Drive
    await drive.files.delete({ fileId }).catch((err) => {
      console.error("Google Drive delete error:", err)
    })

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete file' 
    }, { status: 500 })
  }
}
