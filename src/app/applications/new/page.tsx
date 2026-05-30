'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, type ApplicationFormData } from '@/lib/validations'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function NewApplicationPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'applied',
      applied_date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, url: data.url || null, notes: data.notes || null }),
    })
    if (!res.ok) {
      const result = await res.json()
      setError(result.error)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
            ← Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold">Add application</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {[
            { name: 'company' as const, label: 'Company', placeholder: 'Monzo' },
            { name: 'role' as const, label: 'Role', placeholder: 'Senior Frontend Developer' },
            { name: 'url' as const, label: 'Job URL (optional)', placeholder: 'https://...' },
          ].map(field => (
            <div key={field.name} className="space-y-1">
              <label className="text-xs font-medium text-slate-400">{field.label}</label>
              <input
                {...register(field.name)}
                placeholder={field.placeholder}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm
                  text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50
                  focus:ring-1 focus:ring-indigo-500/30"
              />
              {errors[field.name] && (
                <p className="text-red-400 text-xs">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Status</label>
              <select
                {...register('status')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm
                  text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Applied date</label>
              <input
                {...register('applied_date')}
                type="date"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm
                  text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              />
              {errors.applied_date && (
                <p className="text-red-400 text-xs">{errors.applied_date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Notes (optional)</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Recruiter name, salary range, next steps…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm
                text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50
                focus:ring-1 focus:ring-indigo-500/30 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium
              text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save application'}
          </button>
        </form>
      </div>
    </div>
  )
}