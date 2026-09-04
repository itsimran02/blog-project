import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { getPostBySlug, getAllPublishedSlugs } from '@/features/posts/queries'
import { EditorContent } from '@/components/editor/EditorContent'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BackToTopButton } from '@/components/BackToTopButton'
import { CommentSection } from '@/features/comments/components/CommentSection'
import { ShareButton } from '@/components/ShareButton'
import { ChevronLeftIcon } from 'lucide-react'
import { SubscribeForm } from '@/components/newsletter/SubscribeForm'

export const revalidate = 3600

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://versatilescientist.org').replace(/\/+$/, '')
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const pageTitle = post.seo_title || post.title
  const pageDesc = post.seo_description || post.excerpt || `Read ${post.title} on Versatile Scientist.`
  const ogImages = post.cover_image
    ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
    : []

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: postUrl,
      siteName: 'Versatile Scientist',
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: post.author?.full_name ? [post.author.full_name] : undefined,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const initials = post.author?.full_name
    ? post.author.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : post.author?.email?.[0]?.toUpperCase() ?? '?'

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://versatilescientist.org').replace(/\/+$/, '')
  const postUrl = `${baseUrl}/blog/${post.slug}`

  // 1. Article / BlogPosting Schema
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || '',
    image: post.cover_image ? [post.cover_image] : [],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: post.author?.full_name
      ? {
          '@type': 'Person',
          name: post.author.full_name,
        }
      : {
          '@type': 'Organization',
          name: 'Versatile Scientist',
        },
    publisher: {
      '@type': 'Organization',
      name: 'Versatile Scientist',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.jpg`,
      },
    },
    keywords: post.tags?.map((t) => t.name).join(', ') || undefined,
  }

  // 2. BreadcrumbList Schema for Google Search Snippets
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="container max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeftIcon className="size-3.5" aria-hidden="true" />
            Back to Articles
          </Link>
          {post.category && (
            <Link href={`/blog?category=${post.category.slug}`}>
              <Badge className="rounded-full px-3 text-xs">{post.category.name}</Badge>
            </Link>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight text-foreground">{post.title}</h1>

        <div className="flex items-center gap-3 mb-8 text-sm text-muted-foreground">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{post.author?.full_name ?? post.author?.email}</span>
          {post.published_at && (
            <>
              <span>·</span>
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </time>
            </>
          )}
          <div className="ml-auto">
            <ShareButton
              url={postUrl}
              title={post.title}
            />
          </div>
        </div>

        {post.cover_image && (
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary pl-4 italic leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <EditorContent content={post.content ?? ''} />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/blog?search=${encodeURIComponent(tag.name)}`}>
                <Badge variant="secondary" className="rounded-full px-3 text-xs">#{tag.name}</Badge>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12">
          <SubscribeForm />
        </div>

        <div className="mt-12">
          <CommentSection postId={post.id} postSlug={post.slug} />
        </div>
      </article>
      <BackToTopButton />
    </>
  )
}
