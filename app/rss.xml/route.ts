import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://versatilescientist.org').replace(/\/+$/, '')
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, content, published_at, author:profiles!posts_author_id_fkey(full_name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  const itemsXml = (posts || [])
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`
      const authorName = (post.author as { full_name?: string } | null)?.full_name || 'Versatile Scientist'
      const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : new Date().toUTCString()

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <dc:creator><![CDATA[${authorName}]]></dc:creator>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
    </item>`
    })
    .join('')

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Versatile Scientist</title>
    <link>${siteUrl}</link>
    <description>Empowering students, scholars, and researchers with insights and opportunities.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
