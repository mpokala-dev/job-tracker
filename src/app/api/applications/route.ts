import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getApplications, createApplication } from '@/lib/db'
import { applicationSchema } from '@/lib/validations'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const applications = await getApplications(session.user.id)
  return NextResponse.json(applications)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const parsed = applicationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const application = await createApplication(session.user.id, parsed.data)
  return NextResponse.json(application, { status: 201 })
}