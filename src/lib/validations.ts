import { z } from 'zod'

export const applicationSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['applied', 'interview', 'offer', 'rejected']),
  applied_date: z.string().min(1, 'Date is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export type SignInFormData = z.infer<typeof signInSchema>