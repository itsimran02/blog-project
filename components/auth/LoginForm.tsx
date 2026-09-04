'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { AlertCircle, Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { login } from '@/app/(auth)/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, clearErrors, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.set('email', values.email)
    formData.set('password', values.password)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      if (result.role === 'admin' || result.role === 'author') {
        router.push('/dashboard')
      } else {
        router.push('/blog')
      }
      router.refresh()
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#07163d] tracking-tight">Welcome back</h2>
        <p className="text-sm text-[#64748b] mt-2 font-medium">
          Sign in to your account to read, comment, and engage with the community.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-[#334155]">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10 h-12 border-[#cbd5e1] focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 rounded-xl text-sm font-medium"
              {...register('email', { onChange: () => clearErrors('email') })}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-red-600 animate-in fade-in duration-150 font-medium">
              <AlertCircle className="size-3 shrink-0" />{errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-black uppercase tracking-wider text-[#334155]">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#1d4ed8] hover:underline font-bold"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12 border-[#cbd5e1] focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 rounded-xl text-sm font-medium"
              {...register('password', { onChange: () => clearErrors('password') })}
            />
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-600 animate-in fade-in duration-150 font-medium">
              <AlertCircle className="size-3 shrink-0" />{errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 bg-[#1d4ed8] hover:bg-[#0b1f4d] text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_10px_25px_rgba(29,78,216,0.25)] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing In…
            </>
          ) : (
            <>
              Sign In <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-[#64748b] text-center mt-8 font-medium">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="text-[#1d4ed8] font-bold hover:underline transition-all">
          Create an account
        </Link>
      </p>
    </div>
  )
}
