/**
 * Shared in-memory store for UFA Onboarding rows.
 * Holds the static seed data and allows new rows to be appended
 * when the create form is submitted.
 */
import { create } from 'zustand';

type ApplicantStatus = 'Active' | 'Inactive' | 'Kept in Abeyance' | 'Debarred';
type EvalStatus = 'Pending' | 'Under Review' | 'Evaluated' | 'Rejected';
type Category = 'I' | 'II' | 'III' | 'I/II' | 'II/III';

export interface UfaOnboardingRow {
  id: string;
  sno: number;
  nameOfApplicant: string;
  emailId: string;
  dateOfReceiptOnNhai: string;
  evalStatus: EvalStatus;
  applicantStatus: ApplicantStatus;
  dateOfDeclarationOfResult: string;
  category: Category;
  networthLastTwoFY1: number | null;
  networthLastTwoFY2: number | null;
  networthLastTwoFYAmt: number | null;
  nameOfAuthorisedSignatory: string;
  noOfTollPlaza: number;
  contactNo: string;
  address: string;
  dateKeptInAbeyanceDebarred: string | null;
  debarredPeriod: string | null;
  datalakeUsername: string;
}

const SEED_DATA: UfaOnboardingRow[] = [
  {
    id: '1', sno: 1,
    nameOfApplicant: 'M/s Highroad Toll Services Pvt. Ltd.',
    emailId: 'highroad@example.com',
    dateOfReceiptOnNhai: '2024-03-15',
    evalStatus: 'Evaluated', applicantStatus: 'Active',
    dateOfDeclarationOfResult: '2024-04-20', category: 'I',
    networthLastTwoFY1: 45.5, networthLastTwoFY2: 52.3, networthLastTwoFYAmt: 52.3,
    nameOfAuthorisedSignatory: 'Rajesh Kumar Sharma',
    noOfTollPlaza: 12, contactNo: '9876543210',
    address: '45, Sector 18, Gurugram, Haryana - 122015',
    dateKeptInAbeyanceDebarred: null, debarredPeriod: null,
    datalakeUsername: 'highroad_user',
  },
  {
    id: '2', sno: 2,
    nameOfApplicant: 'M/s National Road Operators Ltd.',
    emailId: 'nrol@example.com',
    dateOfReceiptOnNhai: '2024-02-10',
    evalStatus: 'Under Review', applicantStatus: 'Inactive',
    dateOfDeclarationOfResult: '', category: 'II',
    networthLastTwoFY1: 28.0, networthLastTwoFY2: 31.5, networthLastTwoFYAmt: 31.5,
    nameOfAuthorisedSignatory: 'Priya Verma',
    noOfTollPlaza: 7, contactNo: '9123456780',
    address: '12, Ring Road, New Delhi - 110001',
    dateKeptInAbeyanceDebarred: null, debarredPeriod: null,
    datalakeUsername: 'nrol_user',
  },
  {
    id: '3', sno: 3,
    nameOfApplicant: 'M/s Bharat Expressway Pvt. Ltd.',
    emailId: 'bharatexp@example.com',
    dateOfReceiptOnNhai: '2024-01-05',
    evalStatus: 'Pending', applicantStatus: 'Kept in Abeyance',
    dateOfDeclarationOfResult: '2024-03-01', category: 'I/II',
    networthLastTwoFY1: 18.2, networthLastTwoFY2: 22.7, networthLastTwoFYAmt: 22.7,
    nameOfAuthorisedSignatory: 'Amit Sinha',
    noOfTollPlaza: 5, contactNo: '9988776655',
    address: 'Plot 7, NOIDA Sector 62, UP - 201301',
    dateKeptInAbeyanceDebarred: '2024-02-01', debarredPeriod: '6 months',
    datalakeUsername: 'bharatexp_user',
  },
  {
    id: '4', sno: 4,
    nameOfApplicant: 'M/s Apex Tollway Solutions',
    emailId: 'apex@example.com',
    dateOfReceiptOnNhai: '2024-04-22',
    evalStatus: 'Rejected', applicantStatus: 'Debarred',
    dateOfDeclarationOfResult: '2024-05-15', category: 'III',
    networthLastTwoFY1: 9.1, networthLastTwoFY2: 11.4, networthLastTwoFYAmt: 11.4,
    nameOfAuthorisedSignatory: 'Sunita Pillai',
    noOfTollPlaza: 3, contactNo: '8800112233',
    address: '88, MG Road, Pune, Maharashtra - 411001',
    dateKeptInAbeyanceDebarred: '2024-05-20', debarredPeriod: '1 year',
    datalakeUsername: 'apex_user',
  },
  {
    id: '5', sno: 5,
    nameOfApplicant: 'M/s Pioneer Highway Management',
    emailId: 'pioneer@example.com',
    dateOfReceiptOnNhai: '2024-05-11',
    evalStatus: 'Evaluated', applicantStatus: 'Active',
    dateOfDeclarationOfResult: '2024-06-18', category: 'II/III',
    networthLastTwoFY1: 63.0, networthLastTwoFY2: 71.2, networthLastTwoFYAmt: 71.2,
    nameOfAuthorisedSignatory: 'Vikram Mehta',
    noOfTollPlaza: 18, contactNo: '7700223344',
    address: '3rd Floor, DLF Building, Chennai - 600001',
    dateKeptInAbeyanceDebarred: null, debarredPeriod: null,
    datalakeUsername: 'pioneer_user',
  },
];

interface UfaOnboardingRowsStore {
  rows: UfaOnboardingRow[];
  addRow: (row: Omit<UfaOnboardingRow, 'id' | 'sno'>) => void;
  updateRow: (id: string, patch: Partial<Omit<UfaOnboardingRow, 'id' | 'sno'>>) => void;
}

export const useUfaOnboardingRowsStore = create<UfaOnboardingRowsStore>((set) => ({
  rows: SEED_DATA,
  addRow: (row) =>
    set((s) => ({
      rows: [
        ...s.rows,
        {
          ...row,
          id: String(Date.now()),
          sno: s.rows.length + 1,
        },
      ],
    })),
  updateRow: (id, patch) =>
    set((s) => ({
      rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
}));
