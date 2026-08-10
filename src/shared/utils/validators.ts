import { z } from 'zod';

// ── Reusable Zod schemas for Indian business data ────────────────────────────

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

export const panSchema = z
  .string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN (e.g. ABCDE1234F)');

export const gstSchema = z
  .string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Enter a valid 15-digit GSTIN',
  );

export const pincodeSchema = z
  .string()
  .regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit PIN code');

export const aadhaarSchema = z
  .string()
  .regex(/^\d{12}$/, 'Enter a valid 12-digit Aadhaar number');

export const emailSchema = z.string().email('Enter a valid email address');

export const requiredStringSchema = (fieldName = 'This field') =>
  z.string().min(1, `${fieldName} is required`);

export const positiveAmountSchema = z
  .number({ invalid_type_error: 'Enter a valid amount' })
  .positive('Amount must be greater than 0');

export const futureDateSchema = z
  .string()
  .refine((val) => new Date(val) > new Date(), { message: 'Date must be in the future' });

export const pastDateSchema = z
  .string()
  .refine((val) => new Date(val) <= new Date(), { message: 'Date must be in the past' });

// ── Shared cross-field validations ───────────────────────────────────────────

export const dateRangeRefinement = (
  startKey: string,
  endKey: string,
  message = 'End date must be after start date',
) =>
  (data: Record<string, string>, ctx: z.RefinementCtx) => {
    if (data[startKey] && data[endKey] && new Date(data[endKey]) <= new Date(data[startKey])) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [endKey] });
    }
  };
