import { z } from 'zod'

export const socialMediaSchema = z.object({
  id: z.number().optional(),
  platform: z.string().min(1, 'Platform is required').max(100),
  url: z.string().min(1, 'URL is required').url('Invalid URL format'),
  icon: z.string().max(100).optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type SocialMediaFormData = z.infer<typeof socialMediaSchema>
