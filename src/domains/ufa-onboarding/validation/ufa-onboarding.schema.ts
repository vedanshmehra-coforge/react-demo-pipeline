import { z } from 'zod';

export const createUfaOnboardingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  empanelmentId: z.string().min(1, 'Empanelment is required'),
  agencyName: z.string().min(1, 'Agency name is required'),
  description: z.string().optional(),
});

export const updateUfaOnboardingSchema = createUfaOnboardingSchema.partial().extend({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED']).optional(),
  remarks: z.string().optional(),
});

export type CreateUfaOnboardingFormValues = z.infer<typeof createUfaOnboardingSchema>;
export type UpdateUfaOnboardingFormValues = z.infer<typeof updateUfaOnboardingSchema>;
