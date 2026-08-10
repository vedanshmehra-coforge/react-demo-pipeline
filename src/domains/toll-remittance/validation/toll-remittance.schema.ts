import { z } from 'zod';

export const createTollRemittanceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
});

export const updateTollRemittanceSchema = createTollRemittanceSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateTollRemittanceFormValues = z.infer<typeof createTollRemittanceSchema>;
export type UpdateTollRemittanceFormValues = z.infer<typeof updateTollRemittanceSchema>;
