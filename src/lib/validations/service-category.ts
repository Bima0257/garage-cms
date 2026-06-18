import { z } from 'zod'

export const serviceCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type ServiceCategoryFormData = z.infer<typeof serviceCategorySchema>
