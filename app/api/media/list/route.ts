import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/auth/session'
import { can, type Role } from '@/lib/permissions'
import { listFolder, getR2PublicUrl, isR2Configured } from '@/lib/storage'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const profile = await getProfile()
    if (!profile || !can(profile.role as Role, 'posts:create')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. Only authors and admins can view media library.' },
        { status: 403 }
      )
    }

    const { files, error } = await listFolder({ bucket: 'media', prefix: '' })
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    let publicUrlBase = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || ''
    const isR2 = isR2Configured()

    let supabaseClient: Awaited<ReturnType<typeof createClient>> | null = null
    if (!isR2) {
      supabaseClient = await createClient()
    }

    const mediaItems = files.map((fileKey) => {
      const parts = fileKey.split('/')
      const filename = parts[parts.length - 1]

      let url = ''
      if (isR2) {
        url = getR2PublicUrl(`media/${fileKey}`)
      } else if (supabaseClient) {
        const { data } = supabaseClient.storage.from('media').getPublicUrl(fileKey)
        url = data.publicUrl
      }

      return {
        key: fileKey,
        filename,
        url,
      }
    })

    return NextResponse.json({
      success: true,
      data: mediaItems,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 })
  }
}
