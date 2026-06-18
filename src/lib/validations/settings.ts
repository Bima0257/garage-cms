import { z } from 'zod'

export const settingsSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  tagline: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  vision: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  google_maps: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
