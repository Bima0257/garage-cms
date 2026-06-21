import { z } from 'zod'

export const baseProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  image: z.string().optional().nullable(),
  price: z.number().min(0, 'Price must be positive'),
  discount_price: z.number().min(0).optional().nullable(),
  stock_status: z.enum(['in_stock', 'out_of_stock', 'limited']).default('in_stock'),
  category_id: z.number().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export const productSchema = baseProductSchema.refine(
  (data) => {
    if (data.discount_price !== null && data.discount_price !== undefined) {
      return data.discount_price <= data.price
    }
    return true
  },
  {
    message: 'Discount price cannot be greater than original price',
    path: ['discount_price'],
  }
)

export type ProductFormData = z.infer<typeof productSchema>
