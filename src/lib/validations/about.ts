import { z } from 'zod'

export const aboutSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  tagline: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  vision: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  whatsapp: z.string().max(50).optional().nullable(),
  email: z.string().email().optional().nullable(),
  google_maps: z.string().url().optional().nullable(),
  opening_hours: z.record(z.string(), z.string()).optional().nullable(),
  social_media: z.record(z.string(), z.string()).optional().nullable(),
})

export type AboutFormData = z.infer<typeof aboutSchema>
