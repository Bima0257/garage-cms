import { z } from 'zod'

export const heroSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required').max(255),
  subtitle: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  button_text: z.string().max(100).optional().nullable(),
  button_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type HeroFormData = z.infer<typeof heroSchema>
