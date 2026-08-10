import { z } from 'zod';

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  RATE_CHANGE:  'Rate Change',
  CLOSURE:      'Closure',
  MAINTENANCE:  'Maintenance',
  GENERAL:      'General',
  EMERGENCY:    'Emergency',
};

export const TOLL_MODES  = ['New Toll Plaza', 'Transferred Toll Plaza'] as const;
export const PLAZA_TYPES = ['Public Funded', 'Concessionaire'] as const;

// ─── Toll sub-type options — depend on plazaType ──────────────────────────────
export const PUBLIC_FUNDED_SUB_TYPES = [
  'NHAI Project (HAM/EPC/State PWD)',
  'MoRTH Transferred, entrustment with NHAI',
  'MoRTH Transferred, entrustment with MoRTH',
  'BOT Transferred',
  'BOT Terminated',
  'BOT Suspended',
  'OMT Transferred',
  'OMT Terminated',
  'OMT Suspended',
  'SPV',
] as const;

export const CONCESSIONAIRE_SUB_TYPES = [
  'BOT',
  'OMT',
  'TOT',
  'InVIT',
] as const;

export type PublicFundedSubType      = typeof PUBLIC_FUNDED_SUB_TYPES[number];
export type ConcessionaireSubType    = typeof CONCESSIONAIRE_SUB_TYPES[number];
export type TollSubType = PublicFundedSubType | ConcessionaireSubType | '';

// ─── Toll plaza row ───────────────────────────────────────────────────────────
export const tollPlazaRowSchema = z.object({
  nameOfTollPlaza:      z.string().min(1, 'Name of Toll Plaza is required'),
  locationOfTollPlaza:  z.string().min(1, 'Location is required'),
  noOfTollLane:         z.string().min(1, 'No. of Toll Lanes is required'),
  tempTollPlazaId:      z.string().min(1, 'Temporary Toll Plaza ID is required'),
  permanentTollPlazaId: z.string(),
  tollPlazaCfy:         z.string(),
  trafficSurveyDate:    z.string(),
  tollPlazaApc:         z.string(),
});

// ─── Length details ───────────────────────────────────────────────────────────
export const lengthDetailsSchema = z.object({
  netRoadLength2L:        z.string(),
  netRoadLength4L:        z.string(),
  netBypassLength2L:      z.string(),
  netBypassLength4L:      z.string(),
  netStructureLength2L:   z.string(),
  netStructureLength4L:   z.string(),
  projectLength:          z.string(),
  projectInfluenceLength: z.string(),
});

// ─── Main create/edit form ────────────────────────────────────────────────────
export const createTollNotificationSchema = z.object({
  tollMode:    z.enum(TOLL_MODES),
  upc:         z.string().min(1, 'UPC is required'),
  projectName: z.string().min(1, 'Project Name is required'),
  piuName:     z.string().min(1, 'PIU is required'),
  roName:      z.string().min(1, 'RO is required'),
  plazaType:   z.enum(PLAZA_TYPES),
  tollSubType: z.string(),

  tollingNotApplicable:        z.boolean(),
  tollingNotApplicableRemarks: z.string(),

  appointedDate:        z.string(),
  likelyCompletionDate: z.string(),
  physicalProgress:     z.string(),

  eOfficeFileNo:  z.string().min(1, 'E-Office File No. / Computer No. is required'),
  eOfficeSubject: z.string(),
  documentName:   z.string(),

  tollPlazas:    z.array(tollPlazaRowSchema).min(1, 'At least one toll plaza is required'),
  lengthDetails: lengthDetailsSchema,
});

// ─── CO: Update E-Office ──────────────────────────────────────────────────────
export const updateEOfficeSchema = z.object({
  divEfileNum:  z.string().min(1, 'CO E-Office File No. is required'),
  coFileStatus: z.string(),
});

// ─── CO: Update S.O. Number ───────────────────────────────────────────────────
export const updateSoNumberSchema = z.object({
  notificationSoNumber:      z.string().min(1, 'S.O. Number is required'),
  publishedTollNotification: z.string(),
});

// ─── Reject ───────────────────────────────────────────────────────────────────
export const rejectSchema = z.object({
  rejectionRemarks: z.string().min(10, 'Minimum 10 characters required').max(500),
});

export type CreateTollNotificationFormValues = z.infer<typeof createTollNotificationSchema>;
export type TollPlazaRowFormValues           = z.infer<typeof tollPlazaRowSchema>;
export type UpdateEOfficeFormValues          = z.infer<typeof updateEOfficeSchema>;
export type UpdateSoNumberFormValues         = z.infer<typeof updateSoNumberSchema>;
export type RejectFormValues                 = z.infer<typeof rejectSchema>;
