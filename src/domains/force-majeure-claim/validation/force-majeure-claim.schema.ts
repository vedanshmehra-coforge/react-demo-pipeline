import { z } from 'zod';

export const createForceMajeureSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
});

export const updateForceMajeureSchema = createForceMajeureSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateForceMajeureFormValues = z.infer<typeof createForceMajeureSchema>;
export type UpdateForceMajeureFormValues = z.infer<typeof updateForceMajeureSchema>;
