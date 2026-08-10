import type { BaseEntity } from '@shared/types/common.types';

// ─── Status codes from the real API ─────────────────────────────────────────
// 6667  → Submitted By PIU
// 66691 → E-Office/Computer No. Is Updated By CO Division
// 6668  → S.O Number Updated By CO Division
// 6669  → Published
// 6666  → Draft
// 6670  → Rejected

export type TollNotificationStatusCode =
  | '6666'   // Draft
  | '6667'   // Submitted By PIU
  | '66691'  // E-Office Updated By CO
  | '6668'   // S.O. Number Updated
  | '6669'   // Published
  | '6670';  // Rejected

export type TollNotificationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'CO_REVIEWED'
  | 'SO_ISSUED'
  | 'PUBLISHED'
  | 'REJECTED';

export type TollMode = 'New Toll Plaza' | 'Transferred Toll Plaza';

export type PlazaType = 'Public Funded' | 'Concessionaire';

// ─── Toll Plaza row (the repeating sub-table in the form) ────────────────────
export interface TollPlazaRow {
  id: string;
  nameOfTollPlaza: string;
  locationOfTollPlaza: string;
  noOfTollLane: string;
  tempTollPlazaId: string;
  permanentTollPlazaId: string;
  tollPlazaCfy: string;           // Traffic (PCU) for CFY
  trafficSurveyDate: string;
  tollPlazaApc: string;           // Annual Potential Calculation
}

// ─── Length detail row ───────────────────────────────────────────────────────
export interface LengthDetailRow {
  netRoadLength2L: string;
  netRoadLength4L: string;
  netBypassLength2L: string;
  netBypassLength4L: string;
  netStructureLength2L: string;
  netStructureLength4L: string;
  projectLength: string;          // autofill
  projectInfluenceLength: string; // autofill
}

// ─── Core entity ─────────────────────────────────────────────────────────────
export interface TollNotification extends BaseEntity {
  // API primary keys
  tollNotificationId: string;     // maps to "tollnotificationid"

  // Project identifiers
  upc: string;
  projectName: string;

  // Org
  piuName: string;
  roName: string;

  // Toll mode
  tollMode: TollMode;
  plazaType: PlazaType;
  tollingNotApplicable: boolean;
  tollingNotApplicableRemarks: string;

  // Project dates & progress
  appointedDate: string;
  likelyCompletionDate: string;
  physicalProgress: string;

  // Notification info letter (uploaded document)
  documentName: string;
  publishedTollNotification: string;

  // E-Office
  eOfficeFileNo: string;          // PIU file no
  piuFileStatus: string;
  divEfileNum: string;            // CO file no
  coFileStatus: string;
  eOfficeSubject: string;         // autofill from e-office

  // S.O. Number
  notificationSoNumber: string;

  // Workflow
  status: TollNotificationStatus;
  statusCode: TollNotificationStatusCode;
  statusLabel: string;            // human readable from API "status" field
  rejectionRemarks: string;
  remarkMain: string;

  // Toll plaza rows (the repeating sub-table)
  tollPlazas: TollPlazaRow[];

  // Length details
  lengthDetails: LengthDetailRow;

  // Flags
  upcFlag: string;
  isPlazaNameEditedOnce: boolean;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateTollNotificationDto {
  upc: string;
  projectName: string;
  piuName: string;
  roName: string;
  tollMode: TollMode;
  plazaType: PlazaType;
  tollingNotApplicable: boolean;
  tollingNotApplicableRemarks: string;
  appointedDate: string;
  likelyCompletionDate: string;
  physicalProgress: string;
  documentName: string;
  eOfficeFileNo: string;
  eOfficeSubject: string;
  tollPlazas: Omit<TollPlazaRow, 'id'>[];
  lengthDetails: LengthDetailRow;
}

export interface UpdateTollNotificationDto extends Partial<CreateTollNotificationDto> {
  remarkMain?: string;
}

export interface UpdateEOfficeNumberDto {
  divEfileNum: string;
  coFileStatus: string;
}

export interface UpdateSoNumberDto {
  notificationSoNumber: string;
  publishedTollNotification: string;
}

export interface RejectTollNotificationDto {
  rejectionRemarks: string;
}

// ─── Filter ──────────────────────────────────────────────────────────────────

export interface TollNotificationFilterParams {
  status?: TollNotificationStatus;
  search?: string;
  piuName?: string;
  roName?: string;
  page?: number;
  pageSize?: number;
}
