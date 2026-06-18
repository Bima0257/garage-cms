import { z } from 'zod'

export const siteSettingsSchema = z.object({
  id: z.number().optional(),
  site_name: z.string().min(1, 'Site name is required').max(255),
  tagline: z.string().max(255).optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
  footer_text: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
})

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>
