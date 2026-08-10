import { z } from 'zod';

export const createUfaEmpanelmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  tollMasterId: z.string().min(1, 'Toll Master is required'),
  agencyName: z.string().min(1, 'Agency name is required'),
  agencyCode: z.string().min(1, 'Agency code is required').max(20, 'Agency code too long'),
  description: z.string().optional(),
});

export const updateUfaEmpanelmentSchema = createUfaEmpanelmentSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateUfaEmpanelmentFormValues = z.infer<typeof createUfaEmpanelmentSchema>;
export type UpdateUfaEmpanelmentFormValues = z.infer<typeof updateUfaEmpanelmentSchema>;
