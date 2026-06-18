import { z } from 'zod'

export const serviceSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  price_from: z.number().min(0, 'Price must be positive'),
  duration: z.string().max(100).optional().nullable(),
  category_id: z.number().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
