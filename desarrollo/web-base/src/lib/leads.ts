import { z } from 'zod'

export const LeadSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email no válido'),
  phone: z.string().min(9, 'Teléfono no válido').optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  appointment: z.string().datetime({ offset: true }).optional(),
})

export type Lead = z.infer<typeof LeadSchema>

export interface LeadResult {
  success: boolean
  errors?: z.ZodError['errors']
  data?: Lead
}

export function parseLead(raw: unknown): LeadResult {
  const result = LeadSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, errors: result.error.errors }
  }
  return { success: true, data: result.data }
}
