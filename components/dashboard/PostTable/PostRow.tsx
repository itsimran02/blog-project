'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { PostWithRelations } from '@/features/posts/types'

interface PostRowProps {
  post: PostWithRelations
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  onDelete: (id: string, title: string) => void
}

export function PostRow({ post, onPublish, onUnpublish, onDelete }: PostRowProps) {
  const router = useRouter()
  const authorName = post.author?.full_name ?? post.author?.email ?? '—'
  const authorInitial = authorName[0]?.toUpperCase() ?? '?'

  return (
    <tr className="group hover:bg-[#f8fbff] transition-colors duration-150">
      <td className="px-5 py-4">
        <div>
          <div className="flex items-center flex-wrap gap-1.5">
            <Link
              href={`/dashboard/posts/${post.id}/edit`}
              className="font-bold text-[#07163d] hover:text-[#1d4ed8] transition-colors"
            >
              {post.title}
            </Link>
            {post.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#eef6ff] text-[#1d4ed8] border border-[#93c5fd]/50 uppercase tracking-wider">
                {post.category.name}
              </span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {post.tags.map(tag => (
                <span key={tag.id} className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
          {post.excerpt && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{post.excerpt}</p>
          )}
        </div>
      </td>

      <td className="px-5 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#1d4ed8] text-white text-[10px] font-black shrink-0">
            {authorInitial}
          </div>
          <span className="text-xs font-semibold text-slate-700">{authorName}</span>
        </div>
      </td>

      <td className="px-5 py-4 hidden sm:table-cell">
        {post.status === 'published' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Draft
          </span>
        )}
      </td>

      <td className="px-5 py-4 hidden lg:table-cell text-xs font-medium text-slate-500">
        {post.updated_at ? format(new Date(post.updated_at), 'MMM d, yyyy') : '—'}
      </td>

      <td className="px-5 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Post actions" className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors opacity-70 group-hover:opacity-100 text-slate-600">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/posts/${post.id}/edit`)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit post
            </DropdownMenuItem>
            {post.status === 'draft' ? (
              <DropdownMenuItem onClick={() => onPublish(post.id)}>
                <Eye className="h-4 w-4 mr-2" /> Publish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onUnpublish(post.id)}>
                <EyeOff className="h-4 w-4 mr-2" /> Unpublish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => onDelete(post.id, post.title)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

