import { requireAuth } from '@/lib/auth/session'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { Toaster } from 'sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireAuth()

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#f8fbff] text-foreground">
        <Sidebar profile={profile} />
        <main className="flex-1 overflow-y-auto pt-14 md:pt-0 min-w-0">
          {children}
        </main>
      </div>
      <Toaster richColors />
    </AuthProvider>
  )
}

