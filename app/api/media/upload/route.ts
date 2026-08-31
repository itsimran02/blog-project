import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/auth/session'
import { can, type Role } from '@/lib/permissions'
import { uploadFile } from '@/lib/storage'
import slugify from 'slugify'

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

export async function POST(request: Request) {
  try {
    const profile = await getProfile()
    if (!profile || !can(profile.role as Role, 'posts:create')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. Only authors and admins can upload media.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 10 MB limit' }, { status: 400 })
    }

    const ext = ALLOWED_MIME_TYPES[file.type]
    if (!ext) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Use JPG, PNG, WEBP, GIF, or SVG.' },
        { status: 400 }
      )
    }

    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '/') // YYYY/MM
    const rawName = file.name.replace(/\.[^/.]+$/, '')
    const cleanSlug = slugify(rawName, { lower: true, strict: true }) || 'image'
    const timestamp = Date.now()
    const key = `${datePrefix}/${timestamp}-${cleanSlug}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { publicUrl, error } = await uploadFile({
      bucket: 'media',
      key,
      fileBuffer: buffer,
      contentType: file.type,
    })

    if (error || !publicUrl) {
      return NextResponse.json({ success: false, error: error || 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename: file.name,
        key,
      },
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 })
  }
}
