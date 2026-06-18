import { z } from 'zod'
import bcrypt from 'bcryptjs'

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  username: z.string().min(3, 'Username must be at least 3 characters').max(100),
  email: z.string().email('Invalid email format').optional().nullable(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  photo: z.string().optional().nullable(),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(100).optional(),
  email: z.string().email('Invalid email format').optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false
    }
    return true
  },
  {
    message: 'Current password is required to set a new password',
    path: ['currentPassword'],
  }
)

export type UserFormData = z.infer<typeof userSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
