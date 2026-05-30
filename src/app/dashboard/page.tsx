import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getApplications } from '@/lib/db'
import Link from 'next/link'
import { signOut } from '@/auth'

const STATUS_COLOURS: Record<string, string> = {
  applied: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  interview: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  offer: 'bg-green-500/20 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const applications = await getApplications(session.user.id)

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm">
              📋
            </div>
            <span className="font-semibold">Job Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{session.user.name ?? session.user.email}</span>
            <form action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}>
              <button type="submit" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, colour: 'text-slate-200' },
            { label: 'Applied', value: stats.applied, colour: 'text-blue-300' },
            { label: 'Interview', value: stats.interview, colour: 'text-yellow-300' },
            { label: 'Offer', value: stats.offer, colour: 'text-green-300' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.colour}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Applications list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Applications</h2>
            <Link
              href="/applications/new"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
            >
              + Add application
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl">
              <p className="text-slate-400 text-sm">No applications yet</p>
              <Link href="/applications/new" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
                Add your first one →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800
                    rounded-xl hover:border-slate-600 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                      {app.company[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-200 truncate">{app.company}</p>
                      <p className="text-sm text-slate-400 truncate">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLOURS[app.status]}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(app.applied_date).toLocaleDateString('en-GB')}</span>
                    <span className="text-slate-600 group-hover:text-slate-400 transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}