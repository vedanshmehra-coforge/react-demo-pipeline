import { z } from 'zod';

export const createTollMasterSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
});

export const updateTollMasterSchema = createTollMasterSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateTollMasterFormValues = z.infer<typeof createTollMasterSchema>;
export type UpdateTollMasterFormValues = z.infer<typeof updateTollMasterSchema>;
