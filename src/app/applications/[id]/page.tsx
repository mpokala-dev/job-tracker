import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { getApplication } from '@/lib/db'
import Link from 'next/link'
import ApplicationActions from '@/components/ApplicationActions'

const STATUS_COLOURS: Record<string, string> = {
  applied: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  interview: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  offer: 'bg-green-500/20 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const { id } = await params
  const app = await getApplication(id, session.user.id)
  if (!app) notFound()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
          ← Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{app.company}</h1>
            <p className="text-slate-400 mt-1">{app.role}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLOURS[app.status]}`}>
            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Applied</p>
              <p className="text-sm text-slate-200 mt-1">
                {new Date(app.applied_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {app.url && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Job URL</p>
                <a href={app.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-indigo-400 hover:text-indigo-300 mt-1 block truncate">
                  View posting →
                </a>
              </div>
            )}
          </div>

          {app.notes && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Notes</p>
              <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{app.notes}</p>
            </div>
          )}
        </div>

        <ApplicationActions application={app} />
      </div>
    </div>
  )
}