import { z } from 'zod';

export const createTollBidSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
});

export const updateTollBidSchema = createTollBidSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateTollBidFormValues = z.infer<typeof createTollBidSchema>;
export type UpdateTollBidFormValues = z.infer<typeof updateTollBidSchema>;
