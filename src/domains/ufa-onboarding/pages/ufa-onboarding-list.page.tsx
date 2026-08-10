import { useState, useRef, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, ChevronDown, Eye, RefreshCw, ClipboardList,
  FileText, Activity, Building2, X, Upload, Download,
  AlertTriangle, KeyRound, Clock, Sheet, FileDown,
} from 'lucide-react';
import { PageHeader } from '@shared/components/layout/page-header';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Select } from '@shared/components/ui/select';
import { FormField } from '@shared/components/form-fields/form-field';
import { SearchInput } from '@shared/components/form-fields/search-input';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';
import { useUfaOnboardingRowsStore } from '../store/ufa-onboarding-rows.store';
import type { UfaOnboardingRow } from '../store/ufa-onboarding-rows.store';

type ApplicantStatus = 'Active' | 'Inactive' | 'Kept in Abeyance' | 'Debarred';
type EvalStatus = 'Pending' | 'Under Review' | 'Evaluated' | 'Rejected';
type ActionType = 'update' | 'generate-login' | 'abeyance' | 'debarred' | null;
type ViewType = 'submission' | 'activity-log' | 'detail' | null;

// ─── Status styles ────────────────────────────────────────────────────────────
const APPLICANT_STATUS_STYLES: Record<ApplicantStatus, string> = {
  Active:             'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Inactive:           'bg-gray-100 text-gray-600 border border-gray-200',
  'Kept in Abeyance': 'bg-amber-100 text-amber-700 border border-amber-200',
  Debarred:           'bg-red-100 text-red-700 border border-red-200',
};
const EVAL_STATUS_STYLES: Record<EvalStatus, string> = {
  Pending:       'bg-amber-50 text-amber-700 border border-amber-200',
  'Under Review':'bg-blue-50 text-blue-700 border border-blue-200',
  Evaluated:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected:      'bg-red-50 text-red-700 border border-red-200',
};
const formatCrore = (v: number | null) => (v === null ? '—' : `₹ ${v.toFixed(2)} Cr.`);
const formatDate  = (d: string | null | undefined) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const today = new Date().toISOString().split('T')[0];

// ─── Reusable Modal Shell ─────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  maxWidth?: string;
}
const Modal = ({ open, onClose, title, icon, iconBg, children, footer, maxWidth = 'max-w-xl' }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className={cn('relative w-full rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]', maxWidth)}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
            {icon}
          </div>
          <h2 className="text-base font-semibold text-gray-900 flex-1">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1 space-y-4">{children}</div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl flex items-center justify-end gap-3">
          {footer}
        </div>
      </div>
    </div>
  );
};

// ─── Autofill Field ───────────────────────────────────────────────────────────
const AutofillField = ({ label, value, htmlFor }: { label: string; value: string; htmlFor?: string }) => (
  <FormField label={label} htmlFor={htmlFor}>
    <div className="flex h-9 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-red-500 italic">
      {value || 'Autofill'}
    </div>
  </FormField>
);

// ─── 1. UPDATE DETAILS MODAL ──────────────────────────────────────────────────
const UpdateDetailsModal = ({ row, onClose }: { row: UfaOnboardingRow; onClose: () => void }) => {
  const { updateRow } = useUfaOnboardingRowsStore();
  const [form, setForm] = useState({
    nameOfApplicant: row.nameOfApplicant,
    address: row.address,
    emailId: row.emailId,
    contactNo: row.contactNo,
    nameOfAuthorisedSignatory: row.nameOfAuthorisedSignatory,
    evalStatus: row.evalStatus,
    applicantStatus: row.applicantStatus,
    category: row.category,
    noOfTollPlaza: String(row.noOfTollPlaza),
    datalakeUsername: row.datalakeUsername,
    dateOfReceiptOnNhai: row.dateOfReceiptOnNhai,
    dateOfDeclarationOfResult: row.dateOfDeclarationOfResult,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    updateRow(row.id, {
      ...form,
      evalStatus: form.evalStatus as never,
      applicantStatus: form.applicantStatus as never,
      category: form.category as never,
      noOfTollPlaza: parseInt(form.noOfTollPlaza || '0', 10),
    });
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Update Agency Details"
      icon={<RefreshCw className="w-4 h-4 text-blue-600" />}
      iconBg="bg-blue-100"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </>
      }
    >
      <p className="text-xs text-gray-500 -mt-2">
        Contact No., Email Id and Address are editable. Remaining fields are autofilled. Multiple edits are allowed after form submission.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Name of Applicant (User fee Agency)" htmlFor="upd-name" className="sm:col-span-2">
          <Input id="upd-name" value={form.nameOfApplicant} onChange={(e) => set('nameOfApplicant', e.target.value)} />
        </FormField>
        <FormField label="User fee Agency Address" htmlFor="upd-addr" className="sm:col-span-2">
          <Textarea id="upd-addr" rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} />
        </FormField>
        <FormField label="Name of Authorized Signatory" htmlFor="upd-sig">
          <Input id="upd-sig" value={form.nameOfAuthorisedSignatory} onChange={(e) => set('nameOfAuthorisedSignatory', e.target.value)} />
        </FormField>
        <FormField label="Contact No." htmlFor="upd-contact">
          <Input id="upd-contact" value={form.contactNo} onChange={(e) => set('contactNo', e.target.value)} />
        </FormField>
        <FormField label="Email Id" htmlFor="upd-email" className="sm:col-span-2">
          <Input id="upd-email" type="email" value={form.emailId} onChange={(e) => set('emailId', e.target.value)} />
        </FormField>
        <FormField label="Status of Evaluation" htmlFor="upd-eval">
          <Select id="upd-eval" value={form.evalStatus} onChange={(e) => set('evalStatus', e.target.value)}
            options={[{value:'Pending',label:'Pending'},{value:'Under Review',label:'Under Review'},{value:'Evaluated',label:'Evaluated'},{value:'Rejected',label:'Rejected'}]} />
        </FormField>
        <FormField label="Status of Applicant" htmlFor="upd-status">
          <Select id="upd-status" value={form.applicantStatus} onChange={(e) => set('applicantStatus', e.target.value)}
            options={[{value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'},{value:'Kept in Abeyance',label:'Kept in Abeyance'},{value:'Debarred',label:'Debarred'}]} />
        </FormField>
        <FormField label="Category (I/II)" htmlFor="upd-cat">
          <Select id="upd-cat" value={form.category} onChange={(e) => set('category', e.target.value)}
            options={[{value:'I',label:'I'},{value:'II',label:'II'},{value:'III',label:'III'},{value:'I/II',label:'I/II'},{value:'II/III',label:'II/III'}]} />
        </FormField>
        <FormField label="No. of Toll Plaza Handled" htmlFor="upd-plaza">
          <Input id="upd-plaza" type="number" value={form.noOfTollPlaza} onChange={(e) => set('noOfTollPlaza', e.target.value)} />
        </FormField>
        <FormField label="Date of Receipt on NHAI portal" htmlFor="upd-receipt">
          <Input id="upd-receipt" type="date" max={today} value={form.dateOfReceiptOnNhai} onChange={(e) => set('dateOfReceiptOnNhai', e.target.value)} />
        </FormField>
        <FormField label="Date of Declaration of Result" htmlFor="upd-decl">
          <Input id="upd-decl" type="date" max={today} value={form.dateOfDeclarationOfResult} onChange={(e) => set('dateOfDeclarationOfResult', e.target.value)} />
        </FormField>
        <FormField label="Datalake Username" htmlFor="upd-dl" className="sm:col-span-2">
          <Input id="upd-dl" value={form.datalakeUsername} onChange={(e) => set('datalakeUsername', e.target.value)} />
        </FormField>
      </div>
    </Modal>
  );
};

// ─── 2. GENERATE LOGIN MODAL ──────────────────────────────────────────────────
const GenerateLoginModal = ({ row, onClose }: { row: UfaOnboardingRow; onClose: () => void }) => {
  const { updateRow } = useUfaOnboardingRowsStore();
  const [datalakeUsername, setDatalakeUsername] = useState(row.datalakeUsername);

  const handleSubmit = () => {
    updateRow(row.id, { datalakeUsername });
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Generate Login Credential"
      icon={<KeyRound className="w-4 h-4 text-indigo-600" />}
      iconBg="bg-indigo-100"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </>
      }
    >
      <p className="text-xs text-gray-500 -mt-2">
        Autofilled fields are pulled from the agency record. Visible after form submission; disappears after login credentials are issued.
      </p>
      <div className="space-y-4">
        <AutofillField label="Permanent Toll Plaza" value={String(row.noOfTollPlaza)} />
        <AutofillField label="User fee Agency Name" value={row.nameOfApplicant} />
        <AutofillField label="Name of Authorized Signatory" value={row.nameOfAuthorisedSignatory} />
        <div className="grid grid-cols-2 gap-4">
          <AutofillField label="Contact No" value={row.contactNo} />
          <AutofillField label="Email Id" value={row.emailId} />
        </div>
        <AutofillField label="Address" value={row.address} />
        <FormField label="DataLake Username" htmlFor="gl-username">
          <Input
            id="gl-username"
            value={datalakeUsername}
            onChange={(e) => setDatalakeUsername(e.target.value)}
            placeholder="Enter datalake username"
          />
        </FormField>
      </div>
    </Modal>
  );
};

// ─── 3. KEPT IN ABEYANCE MODAL ────────────────────────────────────────────────
const KeptInAbeyanceModal = ({ row, onClose }: { row: UfaOnboardingRow; onClose: () => void }) => {
  const { updateRow } = useUfaOnboardingRowsStore();
  const [abeyanceDate, setAbeyanceDate] = useState(today);
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    updateRow(row.id, {
      applicantStatus: 'Kept in Abeyance',
      dateKeptInAbeyanceDebarred: abeyanceDate,
      debarredPeriod: duration,
    });
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Kept in Abeyance"
      icon={<Clock className="w-4 h-4 text-amber-600" />}
      iconBg="bg-amber-100"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            className="bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 -mt-1">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          This action will change the applicant status to <strong>Kept in Abeyance</strong>. This is reversible.
        </p>
      </div>
      <div className="space-y-4">
        <AutofillField label="User fee Agency Name" value={row.nameOfApplicant} />
        <AutofillField label="Name of Authorized Signatory" value={row.nameOfAuthorisedSignatory} />
        <AutofillField label="Email Id" value={row.emailId} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of Abeyance" htmlFor="ab-date">
            <Input
              id="ab-date"
              type="date"
              max={today}
              value={abeyanceDate}
              onChange={(e) => setAbeyanceDate(e.target.value)}
            />
          </FormField>
          <FormField label="Duration of Abeyance" htmlFor="ab-duration">
            <Input
              id="ab-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 months"
            />
          </FormField>
        </div>
        <FormField label="Reason" htmlFor="ab-reason">
          <Textarea
            id="ab-reason"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="State the reason for placing in abeyance..."
          />
        </FormField>
      </div>
    </Modal>
  );
};

// ─── 4. DEBARRED MODAL ────────────────────────────────────────────────────────
const DebarredModal = ({ row, onClose }: { row: UfaOnboardingRow; onClose: () => void }) => {
  const { updateRow } = useUfaOnboardingRowsStore();
  const [isOffline, setIsOffline] = useState<'yes' | 'no'>('no');
  const [offlineDate, setOfflineDate] = useState('');
  const [debarDate] = useState(today);
  const [duration, setDuration] = useState('');
  const [letterMode, setLetterMode] = useState<'generate' | 'upload'>('generate');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    updateRow(row.id, {
      applicantStatus: 'Debarred',
      dateKeptInAbeyanceDebarred: isOffline === 'yes' ? offlineDate : debarDate,
      debarredPeriod: duration,
    });
    onClose();
  };

  // Min date = today - 2 weeks (for legacy offline entry)
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <Modal
      open
      onClose={onClose}
      title="Debarment of User fee Agency"
      icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
      iconBg="bg-red-100"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmit}>Submit</Button>
        </>
      }
    >
      <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 -mt-1">
        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-red-700">
          This action will mark the agency as <strong>Debarred</strong> and update status on the NHAI web site via API.
        </p>
      </div>

      <div className="space-y-4">
        <AutofillField label="User fee Agency Name" value={row.nameOfApplicant} />
        <div className="grid grid-cols-2 gap-4">
          <AutofillField label="Name of Authorized Signatory" value={row.nameOfAuthorisedSignatory} />
          <AutofillField label="Email Id" value={row.emailId} />
        </div>

        {/* Offline flag */}
        <div className="flex items-center gap-6 py-1">
          <span className="text-sm font-medium text-gray-700">Is Debarment issued offline?</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="offline" value="yes" checked={isOffline === 'yes'} onChange={() => setIsOffline('yes')} className="accent-red-600" />
            Yes
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="offline" value="no" checked={isOffline === 'no'} onChange={() => setIsOffline('no')} className="accent-red-600" />
            No
          </label>
        </div>

        {/* Offline date (present day ± 2 weeks) */}
        {isOffline === 'yes' && (
          <FormField label="Offline Debarment Issuance Date" htmlFor="db-offline-date"
            hint="Accepts present day and up to 2 weeks in the past.">
            <Input
              id="db-offline-date"
              type="date"
              min={twoWeeksAgo}
              max={today}
              value={offlineDate}
              onChange={(e) => setOfflineDate(e.target.value)}
              className="border-yellow-400 bg-yellow-50 focus:ring-yellow-400"
            />
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of Debarment" htmlFor="db-date">
            <Input
              id="db-date"
              type="date"
              value={debarDate}
              readOnly
              className="bg-yellow-50 border-yellow-300 text-gray-500 cursor-not-allowed"
              title="System date"
            />
          </FormField>
          <FormField label="Duration of Debarment" htmlFor="db-duration">
            <Input
              id="db-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 1 year"
              className="border-yellow-400 bg-yellow-50"
            />
          </FormField>
        </div>

        {/* Debarment letter */}
        <div className="space-y-3 p-4 bg-yellow-50/60 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-gray-700">Debarment Letter</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
              <input type="radio" name="letter" value="generate" checked={letterMode === 'generate'} onChange={() => setLetterMode('generate')} className="accent-blue-600" />
              Generate Letter
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
              <input type="radio" name="letter" value="upload" checked={letterMode === 'upload'} onChange={() => setLetterMode('upload')} className="accent-blue-600" />
              Upload Letter
            </label>
          </div>

          {letterMode === 'generate' ? (
            <Button type="button" variant="secondary" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}
              className="bg-blue-600 text-white hover:bg-blue-700">
              Generate Letter
            </Button>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-9 items-center gap-2 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 text-gray-400" />
                {uploadedFile ? uploadedFile.name : 'Choose File'}
              </div>
              <input type="file" accept=".pdf,.doc,.docx" className="sr-only"
                onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)} />
            </label>
          )}

          {/* Preview download row */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-gray-700">Debarment Letter</span>
            <button type="button" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button type="button" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ─── PDF / Excel generator helper ────────────────────────────────────────────
// Static activity log seed (per row)
const ACTIVITY_LOG_STATIC = [
  { date: '15 Mar 2024', user: 'CO Admin', action: 'Form submitted', note: 'Initial onboarding form received.' },
  { date: '20 Mar 2024', user: 'CO Admin', action: 'Details verified', note: 'All documents verified successfully.' },
  { date: '05 Apr 2024', user: 'System',   action: 'Status updated',  note: 'Status changed to Evaluated.' },
  { date: '20 Apr 2024', user: 'CO Admin', action: 'Result declared',  note: 'Date of declaration entered.' },
];

// Static toll plaza detail rows for "View User Fee Agency Detail"
const TOLL_PLAZA_STATIC = [
  { sno: 1, permanentTollId: 'NH-44-101', contractPeriod: '2022–2027', financialQuote: '₹ 8.50 Cr.', loaDate: '01 Jun 2022', acceptanceLetter: 'Yes', apc: 'Yes', pgb: 'Yes', agreement: 'Signed' },
  { sno: 2, permanentTollId: 'NH-44-102', contractPeriod: '2022–2027', financialQuote: '₹ 9.20 Cr.', loaDate: '01 Jun 2022', acceptanceLetter: 'Yes', apc: 'No',  pgb: 'Yes', agreement: 'Signed' },
  { sno: 3, permanentTollId: 'NH-58-204', contractPeriod: '2023–2028', financialQuote: '₹ 7.80 Cr.', loaDate: '15 Jan 2023', acceptanceLetter: 'Yes', apc: 'Yes', pgb: 'No',  agreement: 'Pending' },
];

// ─── V1. SUBMISSION MODAL ─────────────────────────────────────────────────────
const SubmissionModal = ({ row, onClose }: { row: UfaOnboardingRow; onClose: () => void }) => {
  const handlePdf = () => alert('PDF generation triggered. In production this calls the report API.');

  return (
    <Modal
      open
      onClose={onClose}
      title="Submission — User fee Agency Details"
      icon={<FileText className="w-4 h-4 text-blue-600" />}
      iconBg="bg-blue-100"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Back</Button>
          <Button
            variant="secondary"
            leftIcon={<FileDown className="w-4 h-4" />}
            onClick={handlePdf}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Generate PDF
          </Button>
        </>
      }
    >
      {/* Read-only info note */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 -mt-1">
        This is a <strong>read-only</strong> view of the submitted form. All documents submitted are part of the correspondence with title (also in reference document).
      </div>

      {/* Agency details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-1">
        {[
          ['Name of Applicant (User fee Agency)', row.nameOfApplicant],
          ['User fee Agency Address',              row.address],
          ['Name of Authorized Signatory',         row.nameOfAuthorisedSignatory],
          ['Contact No.',                          row.contactNo],
          ['Email Id',                             row.emailId],
          ['Date of Receipt on NHAI portal',       row.dateOfReceiptOnNhai ? new Date(row.dateOfReceiptOnNhai).toLocaleDateString('en-IN') : '—'],
          ['Status of Evaluation',                 row.evalStatus],
          ['Status of Applicant',                  row.applicantStatus],
          ['Date of Declaration of Result',        row.dateOfDeclarationOfResult ? new Date(row.dateOfDeclarationOfResult).toLocaleDateString('en-IN') : '—'],
          ['Category',                             row.category],
          ['No. of Toll Plaza Handled',            String(row.noOfTollPlaza)],
          ['Datalake Username',                    row.datalakeUsername],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm text-gray-800 font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Networth */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Networth for Last two FY</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-500">S.No</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-500">Financial Year</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-500">Amount (Rs. In Crore)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="px-3 py-2">1</td><td className="px-3 py-2">FY 2022-23</td><td className="px-3 py-2 font-medium">{row.networthLastTwoFY1 !== null ? `₹ ${row.networthLastTwoFY1} Cr.` : '—'}</td></tr>
              <tr><td className="px-3 py-2">2</td><td className="px-3 py-2">FY 2023-24</td><td className="px-3 py-2 font-medium">{row.networthLastTwoFY2 !== null ? `₹ ${row.networthLastTwoFY2} Cr.` : '—'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

// ─── V2. ACTIVITY LOG MODAL ───────────────────────────────────────────────────
const ActivityLogModal = ({ row, onClose }: { row: UfaOnboardingRow; onClose: () => void }) => {
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState(ACTIVITY_LOG_STATIC);

  const addNote = () => {
    if (!note.trim()) return;
    setLogs((l) => [
      {
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        user: 'Current User',
        action: 'Note added',
        note: note.trim(),
      },
      ...l,
    ]);
    setNote('');
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Activity Log"
      icon={<Activity className="w-4 h-4 text-purple-600" />}
      iconBg="bg-purple-100"
      maxWidth="max-w-2xl"
      footer={
        <Button variant="outline" onClick={onClose}>Back</Button>
      }
    >
      {/* Agency name banner */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100 -mt-1">
        <Building2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-purple-800">{row.nameOfApplicant}</p>
          <p className="text-[10px] text-purple-600">{row.emailId}</p>
        </div>
      </div>

      {/* Add note */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-600">Add Note</p>
        <div className="flex gap-2">
          <Textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your note here…"
            className="flex-1 text-xs"
          />
          <Button size="sm" onClick={addNote} className="self-end shrink-0">Add</Button>
        </div>
      </div>

      {/* Log timeline */}
      <div className="space-y-2 pt-1">
        <p className="text-xs font-semibold text-gray-600">History</p>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                {i < logs.length - 1 && <div className="w-px flex-1 bg-gray-200" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-800">{log.action}</span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{log.date} · {log.user}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{log.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

// ─── V3. VIEW USER FEE AGENCY DETAIL MODAL ───────────────────────────────────
const ViewAgencyDetailModal = ({ row, onClose }: { row: UfaOnboardingRow; onClose: () => void }) => {
  const handlePdf = () => alert('PDF generation triggered. In production this calls the report API.');
  const handleExcel = () => alert('Excel generation triggered. In production this calls the export API.');

  return (
    <Modal
      open
      onClose={onClose}
      title="User fee Agency Details"
      icon={<Building2 className="w-4 h-4 text-teal-600" />}
      iconBg="bg-teal-100"
      maxWidth="max-w-4xl"
      footer={
        <Button variant="outline" onClick={onClose}>Close</Button>
      }
    >
      {/* PDF / Excel export buttons */}
      <div className="flex items-center gap-2 -mt-1">
        <button
          onClick={handlePdf}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          <FileDown className="w-3.5 h-3.5" />
          PDF
        </button>
        <button
          onClick={handleExcel}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        >
          <Sheet className="w-3.5 h-3.5" />
          Excel
        </button>
        <span className="text-[10px] text-gray-400 ml-1">Download full report</span>
      </div>

      {/* Autofill agency fields */}
      <div className="grid grid-cols-1 gap-3 pt-1">
        {[
          ['Project Name',           'NH-44 Tollway Development Project'],
          ['Contractor / Concessionaire', 'M/s National Highway Projects Ltd.'],
          ['User fee Agency Name',   row.nameOfApplicant],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-48 shrink-0 text-sm font-medium text-gray-700">{label}</span>
            <div className="flex-1 h-9 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-red-500 italic">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Toll plaza table */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Toll Plaza Details</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['S.No', 'View', 'Permanent Toll Id', 'Contract Period', 'Financial Quote', 'LOA Date', 'Acceptance Letter', 'APC', 'PGB', 'Agreement'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TOLL_PLAZA_STATIC.map((p) => (
                <tr key={p.sno} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 text-gray-500">{p.sno}</td>
                  <td className="px-3 py-2">
                    <button className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                  <td className="px-3 py-2 font-mono text-blue-700">{p.permanentTollId}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{p.contractPeriod}</td>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">{p.financialQuote}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{p.loaDate}</td>
                  <td className="px-3 py-2">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', p.acceptanceLetter === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>{p.acceptanceLetter}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', p.apc === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>{p.apc}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', p.pgb === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>{p.pgb}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', p.agreement === 'Signed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}>{p.agreement}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 space-y-1 text-[11px] text-gray-500">
          <p><strong className="text-gray-700">Note:</strong></p>
          <p>1. In MOM — Download &amp; View buttons will appear.</p>
          <p>2. Data in table will auto-fetch from User fee Agency.</p>
        </div>
      </div>
    </Modal>
  );
};

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const ACTION_OPTIONS = [
  { label: 'Update Details',   icon: <RefreshCw  className="w-3.5 h-3.5" /> },
  { label: 'Generate Login',   icon: <ClipboardList className="w-3.5 h-3.5" /> },
  { label: 'Kept in Abeyance', icon: <FileText   className="w-3.5 h-3.5" /> },
  { label: 'Debarred',         icon: <X          className="w-3.5 h-3.5" /> },
];
const VIEW_OPTIONS = [
  { label: 'Submission',                  icon: <FileText  className="w-3.5 h-3.5" /> },
  { label: 'Activity Log',               icon: <Activity  className="w-3.5 h-3.5" /> },
  { label: 'View User Fee Agency Detail', icon: <Building2 className="w-3.5 h-3.5" /> },
];

interface DropdownMenuProps {
  label: string;
  options: { label: string; icon: React.ReactNode }[];
  onSelect: (label: string) => void;
  variant?: 'action' | 'view';
}
const DropdownMenu = ({ label, options, onSelect, variant = 'action' }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const isView = variant === 'view';
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
          isView
            ? 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-40 mt-1 left-0 min-w-[190px] rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 py-1">
          {options.map((opt) => (
            <button
              key={opt.label}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => { onSelect(opt.label); setOpen(false); }}
            >
              <span className="text-gray-400">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, colorClass }: { label: string; value: number; colorClass: string }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 min-w-[140px]">
    <div className={cn('w-2 h-8 rounded-full flex-shrink-0', colorClass)} />
    <div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 leading-tight">{label}</p>
    </div>
  </div>
);

// ─── Table helpers ────────────────────────────────────────────────────────────
const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn('px-3 py-3 text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50', className)}>
    {children}
  </th>
);
const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn('px-3 py-3 text-xs text-gray-700 align-middle', className)}>{children}</td>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export const UfaOnboardingListPage = () => {
  const navigate = useNavigate();
  const { rows } = useUfaOnboardingRowsStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicantStatus | 'All'>('All');

  // Modal state: which action + which row
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [activeRow, setActiveRow] = useState<UfaOnboardingRow | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(null);

  const openModal = (action: ActionType, row: UfaOnboardingRow) => {
    setActiveAction(action);
    setActiveRow(row);
  };
  const openViewModal = (view: ViewType, row: UfaOnboardingRow) => {
    setActiveView(view);
    setActiveRow(row);
  };
  const closeModal = () => { setActiveAction(null); setActiveView(null); setActiveRow(null); };

  const handleAction = (label: string, row: UfaOnboardingRow) => {
    if (label === 'Update Details')   openModal('update', row);
    if (label === 'Generate Login')   openModal('generate-login', row);
    if (label === 'Kept in Abeyance') openModal('abeyance', row);
    if (label === 'Debarred')         openModal('debarred', row);
  };

  const handleView = (view: string, row: UfaOnboardingRow) => {
    if (view === 'Submission')                  openViewModal('submission', row);
    if (view === 'Activity Log')               openViewModal('activity-log', row);
    if (view === 'View User Fee Agency Detail') openViewModal('detail', row);
  };

  const statuses: ApplicantStatus[] = ['Active', 'Inactive', 'Kept in Abeyance', 'Debarred'];
  const filtered = rows.filter((row) => {
    const s = search.toLowerCase();
    const matchSearch = !s ||
      row.nameOfApplicant.toLowerCase().includes(s) ||
      row.emailId.toLowerCase().includes(s) ||
      row.datalakeUsername.toLowerCase().includes(s) ||
      row.contactNo.includes(s);
    return matchSearch && (statusFilter === 'All' || row.applicantStatus === statusFilter);
  });

  const counts = {
    total:    rows.length,
    active:   rows.filter((r) => r.applicantStatus === 'Active').length,
    abeyance: rows.filter((r) => r.applicantStatus === 'Kept in Abeyance').length,
    debarred: rows.filter((r) => r.applicantStatus === 'Debarred').length,
  };

  return (
    <Fragment>
      <div className="space-y-5">
        {/* Header */}
        <PageHeader
          title="UFA Onboarding"
          description="User Fee Agency onboarding management portal"
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'UFA Onboarding' }]}
          actions={
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate(ROUTES.UFA_ONBOARDING.CREATE)}>
              New Onboarding
            </Button>
          }
        />

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <StatCard label="Total Applications" value={counts.total}    colorClass="bg-blue-500" />
          <StatCard label="Active"             value={counts.active}   colorClass="bg-emerald-500" />
          <StatCard label="Kept in Abeyance"   value={counts.abeyance} colorClass="bg-amber-500" />
          <StatCard label="Debarred"           value={counts.debarred} colorClass="bg-red-500" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-medium text-gray-500">Status legend:</span>
          {statuses.map((s) => (
            <span key={s} className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', APPLICANT_STATUS_STYLES[s])}>{s}</span>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-800">Applications</h2>
              <Badge variant="info">{filtered.length} records</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                <button
                  onClick={() => setStatusFilter('All')}
                  className={cn('px-3 py-1 rounded-md text-[14px] font-medium transition-all',
                    statusFilter === 'All' ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700')}
                >All</button>
                {statuses.map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={cn('px-3 py-1 rounded-md text-[14px] font-medium transition-all',
                      statusFilter === s ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700')}
                  >{s}</button>
                ))}
              </div>
              <SearchInput value={search} onChange={setSearch} placeholder="Search applicant, email, contact..." className="w-56" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1400px]">
              <thead className="border-b border-gray-100">
                <tr>
                  <Th className="w-10 text-center">S.No</Th>
                  <Th>Action</Th>
                  <Th>View</Th>
                  <Th>Status</Th>
                  <Th className="max-w-[160px]">Name of Applicant<br /><span className="normal-case text-[9px] font-normal text-gray-400">(User fee Agency)</span></Th>
                  <Th>Email Id</Th>
                  <Th>Date of Receipt of<br /><span className="normal-case text-[9px] font-normal text-gray-400">Application on NHAI portal</span></Th>
                  <Th>Status of Evaluation<br /><span className="normal-case text-[9px] font-normal text-gray-400">of Application</span></Th>
                  <Th>Status of Applicant</Th>
                  <Th>Date of Declaration<br /><span className="normal-case text-[9px] font-normal text-gray-400">of Result</span></Th>
                  <Th>Category (I/II)</Th>
                  <Th>Networth Last two FY<br /><span className="normal-case text-[9px] font-normal text-gray-400">FY – Amount</span></Th>
                  <Th>Networth Last two FY<br /><span className="normal-case text-[9px] font-normal text-gray-400">(Rs. In Cr.)</span></Th>
                  <Th>Networth Last two FY<br /><span className="normal-case text-[9px] font-normal text-gray-400">(Rs. In Cr.)</span></Th>
                  <Th>Name of Authorised Signatory</Th>
                  <Th>No of Toll Plaza<br /><span className="normal-case text-[9px] font-normal text-gray-400">Handled</span></Th>
                  <Th>Contact No.</Th>
                  <Th>Address</Th>
                  <Th>Date of Kept in<br /><span className="normal-case text-[9px] font-normal text-gray-400">Abeyance / Debarred</span></Th>
                  <Th>Debarred Period</Th>
                  <Th className="bg-yellow-50 text-yellow-700">Datalake Username</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={21} className="py-16 text-center text-sm text-gray-400">No records found. Try adjusting your search or filters.</td></tr>
                ) : filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <Td className="text-center font-medium text-gray-500">{row.sno}</Td>

                    <Td>
                      <DropdownMenu label="Action" options={ACTION_OPTIONS} variant="action"
                        onSelect={(lbl) => handleAction(lbl, row)} />
                    </Td>

                    <Td>
                      <DropdownMenu label="View" options={VIEW_OPTIONS} variant="view"
                        onSelect={(lbl) => handleView(lbl, row)} />
                    </Td>

                    <Td>
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium', APPLICANT_STATUS_STYLES[row.applicantStatus])}>
                        {row.applicantStatus}
                      </span>
                    </Td>

                    <Td className="max-w-[160px]">
                      <span className="block font-medium text-gray-800 truncate" title={row.nameOfApplicant}>{row.nameOfApplicant}</span>
                    </Td>

                    <Td>
                      <a href={`mailto:${row.emailId}`} className="text-blue-600 hover:underline whitespace-nowrap">{row.emailId}</a>
                    </Td>

                    <Td className="whitespace-nowrap">{formatDate(row.dateOfReceiptOnNhai)}</Td>

                    <Td>
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap', EVAL_STATUS_STYLES[row.evalStatus])}>
                        {row.evalStatus}
                      </span>
                    </Td>

                    <Td className="whitespace-nowrap text-gray-600">{row.applicantStatus}</Td>
                    <Td className="whitespace-nowrap">{formatDate(row.dateOfDeclarationOfResult)}</Td>

                    <Td>
                      <span className="inline-flex items-center justify-center w-12 h-6 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                        {row.category}
                      </span>
                    </Td>

                    <Td className="whitespace-nowrap tabular-nums">{formatCrore(row.networthLastTwoFY1)}</Td>
                    <Td className="whitespace-nowrap tabular-nums">{formatCrore(row.networthLastTwoFY2)}</Td>
                    <Td className="whitespace-nowrap tabular-nums font-medium text-gray-800">{formatCrore(row.networthLastTwoFYAmt)}</Td>
                    <Td className="whitespace-nowrap">{row.nameOfAuthorisedSignatory}</Td>
                    <Td className="text-center tabular-nums">{row.noOfTollPlaza}</Td>
                    <Td className="whitespace-nowrap tabular-nums">{row.contactNo}</Td>

                    <Td className="max-w-[180px]">
                      <span className="block truncate" title={row.address}>{row.address}</span>
                    </Td>

                    <Td className="whitespace-nowrap">{formatDate(row.dateKeptInAbeyanceDebarred)}</Td>
                    <Td>{row.debarredPeriod ?? '—'}</Td>

                    <Td className="bg-yellow-50/60">
                      <span className="font-mono text-[11px] text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded">
                        {row.datalakeUsername}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium text-gray-700">{filtered.length}</span> of{' '}
              <span className="font-medium text-gray-700">{rows.length}</span> records
            </p>
            <p className="text-xs text-gray-400">
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Click "View" on any row to explore details
            </p>
          </div>
        </div>
      </div>

      {/* ── Action Modals ─────────────────────────────────────────────────── */}
      {activeRow && activeAction === 'update' && (
        <UpdateDetailsModal row={activeRow} onClose={closeModal} />
      )}
      {activeRow && activeAction === 'generate-login' && (
        <GenerateLoginModal row={activeRow} onClose={closeModal} />
      )}
      {activeRow && activeAction === 'abeyance' && (
        <KeptInAbeyanceModal row={activeRow} onClose={closeModal} />
      )}
      {activeRow && activeAction === 'debarred' && (
        <DebarredModal row={activeRow} onClose={closeModal} />
      )}

      {/* ── View Modals ───────────────────────────────────────────────────── */}
      {activeRow && activeView === 'submission' && (
        <SubmissionModal row={activeRow} onClose={closeModal} />
      )}
      {activeRow && activeView === 'activity-log' && (
        <ActivityLogModal row={activeRow} onClose={closeModal} />
      )}
      {activeRow && activeView === 'detail' && (
        <ViewAgencyDetailModal row={activeRow} onClose={closeModal} />
      )}
    </Fragment>
  );
};
