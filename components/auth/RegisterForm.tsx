'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { AlertCircle, Loader2, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react'
import { register as registerAction } from '@/app/(auth)/register/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const { register, handleSubmit, clearErrors, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(values: RegisterFormValues) {
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.set('email', values.email)
    formData.set('password', values.password)
    formData.set('full_name', values.full_name)
    const result = await registerAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.needsConfirmation) {
      setNeedsConfirmation(true)
      setLoading(false)
    } else if (result?.success) {
      router.push('/blog')
      router.refresh()
    }
  }

  if (needsConfirmation) {
    return (
      <div className="text-center animate-in fade-in duration-300 py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-[#1d4ed8]" />
        </div>
        <h2 className="text-2xl font-black text-[#07163d] mb-2">Check your email</h2>
        <p className="text-[#64748b] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          We sent a confirmation link to your inbox. Click the link to activate your account and start commenting.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#1d4ed8] font-bold hover:underline"
        >
          Back to sign in <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#07163d] tracking-tight">Create an account</h2>
        <p className="text-sm text-[#64748b] mt-2 font-medium">
          Join our science community to comment on articles and follow research opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-xs font-black uppercase tracking-wider text-[#334155]">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
            <Input
              id="full_name"
              placeholder="John Doe"
              className="pl-10 h-11 border-[#cbd5e1] focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 rounded-xl text-sm font-medium"
              {...register('full_name', { onChange: () => clearErrors('full_name') })}
            />
          </div>
          {errors.full_name && (
            <p className="flex items-center gap-1 text-xs text-red-600 animate-in fade-in duration-150 font-medium">
              <AlertCircle className="size-3 shrink-0" />{errors.full_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-[#334155]">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10 h-11 border-[#cbd5e1] focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 rounded-xl text-sm font-medium"
              {...register('email', { onChange: () => clearErrors('email') })}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-red-600 animate-in fade-in duration-150 font-medium">
              <AlertCircle className="size-3 shrink-0" />{errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-black uppercase tracking-wider text-[#334155]">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              className="pl-10 h-11 border-[#cbd5e1] focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 rounded-xl text-sm font-medium"
              {...register('password', { onChange: () => clearErrors('password') })}
            />
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-600 animate-in fade-in duration-150 font-medium">
              <AlertCircle className="size-3 shrink-0" />{errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-wider text-[#334155]">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              className="pl-10 h-11 border-[#cbd5e1] focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 rounded-xl text-sm font-medium"
              {...register('confirmPassword', { onChange: () => clearErrors('confirmPassword') })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-xs text-red-600 animate-in fade-in duration-150 font-medium">
              <AlertCircle className="size-3 shrink-0" />{errors.confirmPassword.message}
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
              Creating Account…
            </>
          ) : (
            <>
              Create Account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-[#64748b] text-center mt-6 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-[#1d4ed8] font-bold hover:underline transition-all">
          Sign in
        </Link>
      </p>
    </div>
  )
}
