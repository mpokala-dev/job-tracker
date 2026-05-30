import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl mx-auto">
          📋
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Job Tracker</h1>
        <p className="text-slate-400 text-lg">
          Track every application, interview, and offer in one place.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  )
}