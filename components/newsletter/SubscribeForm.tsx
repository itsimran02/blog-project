'use client'

import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Mail } from 'lucide-react'

const schema = z.object({ email: z.string().email('Enter a valid email address') })
type FormValues = z.infer<typeof schema>

interface SubscribeFormProps {
  variant?: 'card' | 'inline' | 'footer'
}

export function SubscribeForm({ variant = 'card' }: SubscribeFormProps) {
  const inputId = useId()
  const [subscribed, setSubscribed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json().catch(() => null)
      if (json?.success) {
        setSubscribed(true)
        toast.success(json.message)
      } else {
        toast.error(json?.message ?? 'Something went wrong')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
  }

  if (subscribed) {
    if (variant === 'footer') {
      return (
        <div className="mx-auto max-w-5xl bg-white px-5 py-5 text-center text-[#07163d] sm:px-8">
          <p className="text-lg font-black">You&apos;re subscribed!</p>
          <p className="mt-1 text-sm font-medium text-[#64748b]">
            You&apos;ll get an email when the next post is published.
          </p>
        </div>
      )
    }

    if (variant === 'inline') {
      return (
        <div className="border border-[#93c5fd] bg-white/80 p-5 text-center shadow-[5px_5px_0_#93c5fd]">
          <p className="font-black text-lg text-[#07163d]">You&apos;re subscribed!</p>
          <p className="text-[#475569] text-sm mt-1">
            You&apos;ll get an email when the next post is published.
          </p>
        </div>
      )
    }

    return (
      <div className="rounded-xl border bg-card p-8 text-center max-w-lg mx-auto mt-12">
        <p className="font-semibold text-lg">You&apos;re subscribed!</p>
        <p className="text-muted-foreground text-sm mt-1">
          You&apos;ll get an email when the next post is published.
        </p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">Email address</label>
        <Input
          {...register('email')}
          id={inputId}
          type="email"
          placeholder="your@email.com"
          className="h-14 flex-1 rounded-none border-[#93c5fd] bg-white text-[#07163d] placeholder:text-[#64748b] focus-visible:ring-[#1d4ed8]"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 rounded-none bg-[#1d4ed8] px-7 font-black uppercase tracking-wide text-white shadow-[5px_5px_0_#93c5fd] hover:bg-[#07163d]"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
        {errors.email && (
          <p className="text-destructive text-xs sm:basis-full">{errors.email.message}</p>
        )}
      </form>
    )
  }

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="flex min-h-20 overflow-hidden border border-white/20 bg-white text-[#07163d] shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
            <label htmlFor={inputId} className="flex w-20 shrink-0 items-center justify-center border-r border-[#dbe3ef] bg-[#eef2f7]">
              <span className="sr-only">Email address</span>
              <Mail className="h-7 w-7 text-black" />
            </label>
            <Input
              {...register('email')}
              id={inputId}
              type="email"
              placeholder="Enter Your E-Mail Address"
              className="h-20 flex-1 rounded-none border-0 bg-white px-7 text-lg font-medium text-[#07163d] shadow-none placeholder:text-[#6b7280] focus-visible:ring-0"
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-20 rounded-none bg-[#1d4ed8] px-8 text-lg font-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] hover:bg-[#38bdf8] hover:text-[#07163d]"
          >
            <Check className="mr-4 h-7 w-7" />
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        {errors.email && (
          <p className="mt-3 text-left text-sm font-semibold text-red-300">{errors.email.message}</p>
        )}
      </form>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-8 text-center max-w-lg mx-auto mt-12">
      <h2 className="text-xl font-bold mb-1">Stay in the loop</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Get notified when new posts are published. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 max-w-sm mx-auto">
        <label htmlFor={inputId} className="sr-only">Email address</label>
        <Input
          {...register('email')}
          id={inputId}
          type="email"
          placeholder="your@email.com"
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {errors.email && (
        <p className="text-destructive text-xs mt-2">{errors.email.message}</p>
      )}
      <p className="text-muted-foreground text-xs mt-3">No spam · Unsubscribe anytime</p>
    </div>
  )
}
