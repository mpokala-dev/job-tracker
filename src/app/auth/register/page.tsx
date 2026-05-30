'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpFormData } from '@/lib/validations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    if (!res.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Auto sign in after registration
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: '/dashboard',
    })

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100">Create account</h1>
          <p className="text-slate-400 text-sm mt-1">Start tracking your applications</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Name</label>
            <input
              {...register('name')}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm
                text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50
                focus:ring-1 focus:ring-indigo-500/30"
              placeholder="Madhuri Pokala"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm
                text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50
                focus:ring-1 focus:ring-indigo-500/30"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm
                text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50
                focus:ring-1 focus:ring-indigo-500/30"
              placeholder="Min. 8 characters"
            />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium
              text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}