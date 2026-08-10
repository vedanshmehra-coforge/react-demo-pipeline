import { z } from 'zod';

export const createTollGrievanceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
});

export const updateTollGrievanceSchema = createTollGrievanceSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateTollGrievanceFormValues = z.infer<typeof createTollGrievanceSchema>;
export type UpdateTollGrievanceFormValues = z.infer<typeof updateTollGrievanceSchema>;
