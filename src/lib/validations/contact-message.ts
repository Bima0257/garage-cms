import { z } from 'zod'

export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi').max(255),
  email: z.string().email('Format email tidak valid').optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  subject: z.string().max(255).optional().nullable(),
  message: z.string().min(1, 'Pesan harus diisi'),
})

export type ContactMessageFormData = z.infer<typeof contactMessageSchema>
