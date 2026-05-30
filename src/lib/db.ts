import { supabaseAdmin } from './supabase'

export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected'

export type JobApplication = {
  id: string
  user_id: string
  company: string
  role: string
  status: ApplicationStatus
  applied_date: string
  url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getApplications(userId: string): Promise<JobApplication[]> {
  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getApplication(id: string, userId: string): Promise<JobApplication | null> {
  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) return null
  return data
}

export async function createApplication(
  userId: string,
  input: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<JobApplication> {
  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .insert({ ...input, user_id: userId })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateApplication(
  id: string,
  userId: string,
  input: Partial<Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<JobApplication> {
  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteApplication(id: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('job_applications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}