import { z } from 'zod'

export const modalPromotionSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  button_text: z.string().max(100).optional().nullable(),
  button_url: z.string().optional().nullable().refine(
    (val) => !val || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    { message: 'URL harus dimulai dengan http://, https://, atau /' }
  ),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_active: z.boolean().default(true),
}).refine(
  (data) => {
    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    return end >= start
  },
  {
    message: 'End date must be after or equal to start date',
    path: ['end_date'],
  }
)

export type ModalPromotionFormData = z.infer<typeof modalPromotionSchema>
