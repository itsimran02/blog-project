'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Loader2, Users, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateUserRole } from '@/features/users/actions'
import type { Profile } from '@/features/users/types'

interface UserTableProps {
  users: Profile[]
  currentUserId: string
}

export function UserTable({ users, currentUserId }: UserTableProps) {
  const [updating, setUpdating] = useState<string | null>(null)

  async function handleRoleChange(userId: string, currentRole: string) {
    const newRole = currentRole === 'author' ? 'user' : 'author'
    if (!confirm(`Change role to ${newRole}? User must log out and back in for the change to take effect.`)) return
    setUpdating(userId)
    const result = await updateUserRole(userId, newRole)
    result.error ? toast.error(result.error) : toast.success(`Role updated to ${newRole}`)
    setUpdating(null)
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border shadow-xs text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">No users yet</h3>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Email</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Joined</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {users.map((user) => {
            const name = user.full_name ?? 'Unnamed'
            const initials = user.full_name
              ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
              : user.email[0]?.toUpperCase() ?? '?'
            const isAdmin = user.role === 'admin'
            const isAuthor = user.role === 'author'
            const isCurrent = user.id === currentUserId

            return (
              <tr key={user.id} className="group hover:bg-muted/40 transition-colors duration-150">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold shrink-0 ${isAdmin ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : isAuthor ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-muted-foreground'}`}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{name}</p>
                      {isCurrent && (
                        <span className="text-[10px] text-primary font-medium">You</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-muted-foreground">{user.email}</td>
                <td className="px-5 py-4">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      Admin (DB Assigned)
                    </span>
                  ) : isAuthor ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Author
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      Member
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-sm text-muted-foreground">
                  {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '—'}
                </td>
                <td className="px-5 py-4 text-right">
                  {!isCurrent && (
                    isAdmin ? (
                      <span className="text-xs text-muted-foreground italic flex items-center justify-end gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-violet-500" /> DB Managed
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updating === user.id}
                        onClick={() => handleRoleChange(user.id, user.role)}
                        className="text-xs h-8"
                      >
                        {updating === user.id ? (
                          <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Updating…</>
                        ) : (
                          isAuthor ? 'Demote to Member' : 'Promote to Author'
                        )}
                      </Button>
                    )
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
