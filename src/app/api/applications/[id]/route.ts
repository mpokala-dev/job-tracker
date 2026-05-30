import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getApplication, updateApplication, deleteApplication } from '@/lib/db'
import { applicationSchema } from '@/lib/validations'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  const application = await getApplication(id, session.user.id)
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(application)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const parsed = applicationSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const application = await updateApplication(id, session.user.id, parsed.data)
  return NextResponse.json(application)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  await deleteApplication(id, session.user.id)
  return NextResponse.json({ success: true })
}