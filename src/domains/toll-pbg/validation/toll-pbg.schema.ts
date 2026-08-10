import { z } from 'zod';

export const createTollPbgSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
});

export const updateTollPbgSchema = createTollPbgSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateTollPbgFormValues = z.infer<typeof createTollPbgSchema>;
export type UpdateTollPbgFormValues = z.infer<typeof updateTollPbgSchema>;
