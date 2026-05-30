'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { JobApplication, ApplicationStatus } from '@/lib/db'

const STATUSES: ApplicationStatus[] = ['applied', 'interview', 'offer', 'rejected']

export default function ApplicationActions({ application }: { application: JobApplication }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const updateStatus = async (status: ApplicationStatus) => {
    setLoading(true)
    await fetch(`/api/applications/${application.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setLoading(false)
  }

  const deleteApplication = async () => {
    if (!confirm('Delete this application?')) return
    setDeleting(true)
    await fetch(`/api/applications/${application.id}`, { method: 'DELETE' })
    router.push('/dashboard')
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Update status</p>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              disabled={loading || application.status === status}
              className={`py-2 rounded-xl text-sm font-medium transition-colors
                ${application.status === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={deleteApplication}
        disabled={deleting}
        className="w-full py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300
          border border-red-500/20 hover:border-red-500/40 transition-colors disabled:opacity-50"
      >
        {deleting ? 'Deleting…' : 'Delete application'}
      </button>
    </div>
  )
}