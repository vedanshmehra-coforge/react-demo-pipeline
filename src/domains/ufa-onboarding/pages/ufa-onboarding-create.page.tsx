import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Save, Send, Trash2, Plus } from 'lucide-react';
import { PageHeader } from '@shared/components/layout/page-header';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Select } from '@shared/components/ui/select';
import { Textarea } from '@shared/components/ui/textarea';
import { FormField } from '@shared/components/form-fields/form-field';
import { ROUTES } from '@shared/constants/routes';

import { useUfaOnboardingRowsStore } from '../store/ufa-onboarding-rows.store';

// -------------------------------------------------------------------------
// Types & constants
// -------------------------------------------------------------------------
interface NetworthEntry {
  financialYear: string;
  amount: string;
}

interface FormValues {
  nameOfApplicant: string;
  address: string;
  nameOfAuthorisedSignatory: string;
  contactNo: string;
  emailId: string;
  evalStatus: string;
  applicantStatus: string;
  dateOfReceiptOnNhai: string;
  dateOfDeclarationOfResult: string;
  category: string;
  noOfTollPlaza: string;
  datalakeUsername: string;
  networthEntries: NetworthEntry[];
}

interface FormErrors {
  nameOfApplicant?: string;
  address?: string;
  nameOfAuthorisedSignatory?: string;
  contactNo?: string;
  emailId?: string;
  category?: string;
  networthEntries?: string;
}

const EVAL_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Evaluated', label: 'Evaluated' },
  { value: 'Rejected', label: 'Rejected' },
];

const APPLICANT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Kept in Abeyance', label: 'Kept in Abeyance' },
  { value: 'Debarred', label: 'Debarred' },
];

const CATEGORY_OPTIONS = [
  { value: 'I', label: 'I' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
  { value: 'I/II', label: 'I/II' },
  { value: 'II/III', label: 'II/III' },
];

const FINANCIAL_YEAR_OPTIONS = [
  { value: '2024-25', label: '2024-25' },
  { value: '2023-24', label: '2023-24' },
  { value: '2022-23', label: '2022-23' },
  { value: '2021-22', label: '2021-22' },
  { value: '2020-21', label: '2020-21' },
];

const DEFAULT_FORM: FormValues = {
  nameOfApplicant: '',
  address: '',
  nameOfAuthorisedSignatory: '',
  contactNo: '',
  emailId: '',
  evalStatus: '',
  applicantStatus: '',
  dateOfReceiptOnNhai: '',
  dateOfDeclarationOfResult: '',
  category: '',
  noOfTollPlaza: '',
  datalakeUsername: '',
  networthEntries: [
    { financialYear: '', amount: '' },
    { financialYear: '', amount: '' },
  ],
};

// -------------------------------------------------------------------------
// Validation
// -------------------------------------------------------------------------
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.nameOfApplicant.trim())
    errors.nameOfApplicant = 'Name of applicant is required.';
  if (!values.address.trim())
    errors.address = 'Address is required.';
  if (!values.nameOfAuthorisedSignatory.trim())
    errors.nameOfAuthorisedSignatory = 'Authorised signatory name is required.';
  if (!values.contactNo.trim())
    errors.contactNo = 'Contact number is required.';
  else if (!/^\d{10}$/.test(values.contactNo.trim()))
    errors.contactNo = 'Enter a valid 10-digit contact number.';
  if (!values.emailId.trim())
    errors.emailId = 'Email Id is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailId.trim()))
    errors.emailId = 'Enter a valid email address.';
  if (!values.category)
    errors.category = 'Category is required.';
  const filledEntries = values.networthEntries.filter((e) => e.financialYear || e.amount);
  if (filledEntries.some((e) => !e.financialYear || !e.amount))
    errors.networthEntries = 'Please fill both Financial Year and Amount for each entry.';
  return errors;
}

// -------------------------------------------------------------------------
// Section wrapper used inside the form card
// -------------------------------------------------------------------------
const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    {title && (
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-blue-600" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

// -------------------------------------------------------------------------
// Main page component
// -------------------------------------------------------------------------
export const UfaOnboardingCreatePage = () => {
  const navigate = useNavigate();
  const { addRow } = useUfaOnboardingRowsStore();

  const [values, setValues] = useState<FormValues>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Generic field updater
  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (submitted) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Networth row helpers
  const updateNetworthEntry = (index: number, field: keyof NetworthEntry, value: string) => {
    const updated = values.networthEntries.map((e, i) =>
      i === index ? { ...e, [field]: value } : e,
    );
    setValues((v) => ({ ...v, networthEntries: updated }));
    if (submitted) setErrors((e) => ({ ...e, networthEntries: undefined }));
  };

  const addNetworthEntry = () => {
    if (values.networthEntries.length >= 5) return;
    setValues((v) => ({
      ...v,
      networthEntries: [...v.networthEntries, { financialYear: '', amount: '' }],
    }));
  };

  const removeNetworthEntry = (index: number) => {
    if (values.networthEntries.length <= 2) return;
    setValues((v) => ({
      ...v,
      networthEntries: v.networthEntries.filter((_, i) => i !== index),
    }));
  };

  // Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const fy1 = values.networthEntries[0];
    const fy2 = values.networthEntries[1];
    const networthAmt = Math.max(
      parseFloat(fy1?.amount || '0'),
      parseFloat(fy2?.amount || '0'),
    );

    addRow({
      nameOfApplicant: values.nameOfApplicant.trim(),
      emailId: values.emailId.trim(),
      dateOfReceiptOnNhai: values.dateOfReceiptOnNhai,
      evalStatus: (values.evalStatus as never) || 'Pending',
      applicantStatus: (values.applicantStatus as never) || 'Active',
      dateOfDeclarationOfResult: values.dateOfDeclarationOfResult,
      category: (values.category as never) || 'I',
      networthLastTwoFY1: parseFloat(fy1?.amount || '0') || null,
      networthLastTwoFY2: parseFloat(fy2?.amount || '0') || null,
      networthLastTwoFYAmt: networthAmt || null,
      nameOfAuthorisedSignatory: values.nameOfAuthorisedSignatory.trim(),
      noOfTollPlaza: parseInt(values.noOfTollPlaza || '0', 10),
      contactNo: values.contactNo.trim(),
      address: values.address.trim(),
      dateKeptInAbeyanceDebarred: null,
      debarredPeriod: null,
      datalakeUsername: values.datalakeUsername.trim() || values.emailId.split('@')[0],
    });

    navigate(ROUTES.UFA_ONBOARDING.LIST);
  };

  // Save as draft — just navigate back for now
  const handleSaveAsDraft = () => navigate(ROUTES.UFA_ONBOARDING.LIST);

  const handleCancel = () => navigate(ROUTES.UFA_ONBOARDING.LIST);

  return (
    <div className="space-y-5 max-w-10xl">
      {/* Page header */}
      <PageHeader
        title="New UFA Onboarding"
        description="Register a new User Fee Agency for onboarding"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'UFA Onboarding', href: ROUTES.UFA_ONBOARDING.LIST },
          { label: 'New Onboarding' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleCancel}
          >
            Back to List
          </Button>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Main form card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-500">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">User fee Agency Details</h2>
              <p className="text-xs text-blue-100">Fill all required fields marked with *</p>
            </div>
          </div>

          {/* Form body */}
          <div className="p-6 space-y-8">

            {/* ── Section 1: Agency identification ─────────────────── */}
            <Section title="Agency Identification">
              <FormField
                label="Name of Applicant (User fee Agency)"
                htmlFor="nameOfApplicant"
                required
                error={errors.nameOfApplicant}
              >
                <Input
                  id="nameOfApplicant"
                  value={values.nameOfApplicant}
                  onChange={(e) => set('nameOfApplicant', e.target.value)}
                  placeholder="e.g. M/s Highroad Toll Services Pvt. Ltd."
                  error={!!errors.nameOfApplicant}
                />
              </FormField>

              <FormField
                label="User fee Agency Address"
                htmlFor="address"
                required
                error={errors.address}
              >
                <Textarea
                  id="address"
                  rows={3}
                  value={values.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Full registered address of the agency"
                  error={!!errors.address}
                />
              </FormField>
            </Section>

            {/* ── Section 2: Contact details ────────────────────────── */}
            <Section title="Contact Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label="Name of Authorized Signatory"
                  htmlFor="nameOfAuthorisedSignatory"
                  required
                  error={errors.nameOfAuthorisedSignatory}
                >
                  <Input
                    id="nameOfAuthorisedSignatory"
                    value={values.nameOfAuthorisedSignatory}
                    onChange={(e) => set('nameOfAuthorisedSignatory', e.target.value)}
                    placeholder="Full name"
                    error={!!errors.nameOfAuthorisedSignatory}
                  />
                </FormField>

                <FormField
                  label="Contact No."
                  htmlFor="contactNo"
                  required
                  error={errors.contactNo}
                >
                  <Input
                    id="contactNo"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={values.contactNo}
                    onChange={(e) => set('contactNo', e.target.value)}
                    placeholder="10-digit mobile"
                    error={!!errors.contactNo}
                  />
                </FormField>

                <FormField
                  label="Email Id"
                  htmlFor="emailId"
                  required
                  error={errors.emailId}
                >
                  <Input
                    id="emailId"
                    type="email"
                    value={values.emailId}
                    onChange={(e) => set('emailId', e.target.value)}
                    placeholder="agency@example.com"
                    error={!!errors.emailId}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="No. of Toll Plaza Handled" htmlFor="noOfTollPlaza">
                  <Input
                    id="noOfTollPlaza"
                    type="number"
                    min="0"
                    value={values.noOfTollPlaza}
                    onChange={(e) => set('noOfTollPlaza', e.target.value)}
                    placeholder="e.g. 12"
                  />
                </FormField>

                <FormField label="Datalake Username" htmlFor="datalakeUsername">
                  <Input
                    id="datalakeUsername"
                    value={values.datalakeUsername}
                    onChange={(e) => set('datalakeUsername', e.target.value)}
                    placeholder="Auto-filled from email if left blank"
                  />
                </FormField>
              </div>
            </Section>

            {/* ── Section 3: Application status ────────────────────── */}
            <Section title="Application Status">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField label="Status of Evaluation of Application" htmlFor="evalStatus">
                  <Select
                    id="evalStatus"
                    value={values.evalStatus}
                    onChange={(e) => set('evalStatus', e.target.value)}
                    placeholder="Select status"
                    options={EVAL_STATUS_OPTIONS}
                  />
                </FormField>

                <FormField label="Status of Applicant (Agency)" htmlFor="applicantStatus">
                  <Select
                    id="applicantStatus"
                    value={values.applicantStatus}
                    onChange={(e) => set('applicantStatus', e.target.value)}
                    placeholder="Select status"
                    options={APPLICANT_STATUS_OPTIONS}
                  />
                </FormField>

                <FormField
                  label="Date of Receipt of Application on RFQ portal"
                  htmlFor="dateOfReceiptOnNhai"
                >
                  <Input
                    id="dateOfReceiptOnNhai"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={values.dateOfReceiptOnNhai}
                    onChange={(e) => set('dateOfReceiptOnNhai', e.target.value)}
                  />
                </FormField>

                <FormField
                  label="Date of Declaration of Result"
                  htmlFor="dateOfDeclarationOfResult"
                >
                  <Input
                    id="dateOfDeclarationOfResult"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={values.dateOfDeclarationOfResult}
                    onChange={(e) => set('dateOfDeclarationOfResult', e.target.value)}
                  />
                </FormField>
              </div>
            </Section>

            {/* ── Section 4: Category & Networth ───────────────────── */}
            <Section title="Category & Networth">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {/* Category */}
                <FormField
                  label="Category (I/II)"
                  htmlFor="category"
                  required
                  error={errors.category}
                >
                  <Select
                    id="category"
                    value={values.category}
                    onChange={(e) => set('category', e.target.value)}
                    placeholder="Select category"
                    options={CATEGORY_OPTIONS}
                    error={!!errors.category}
                  />
                </FormField>

                {/* Networth table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Networth for Last two FY
                    </span>
                    {values.networthEntries.length < 5 && (
                      <button
                        type="button"
                        onClick={addNetworthEntry}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add FY
                      </button>
                    )}
                  </div>

                  {errors.networthEntries && (
                    <p className="text-xs text-red-600" role="alert">{errors.networthEntries}</p>
                  )}

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-8">S.No</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Select Financial Year</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Amount (Rs. In Crore)</th>
                          <th className="w-8" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {values.networthEntries.map((entry, i) => (
                          <tr key={i} className="bg-white">
                            <td className="px-3 py-2 text-xs text-gray-500 font-medium">{i + 1}</td>
                            <td className="px-3 py-2">
                              <Select
                                value={entry.financialYear}
                                onChange={(e) => updateNetworthEntry(i, 'financialYear', e.target.value)}
                                placeholder="Select FY"
                                options={FINANCIAL_YEAR_OPTIONS}
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={entry.amount}
                                onChange={(e) => updateNetworthEntry(i, 'amount', e.target.value)}
                                placeholder="0.00"
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="px-2 py-2">
                              {values.networthEntries.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeNetworthEntry(i)}
                                  className="text-gray-300 hover:text-red-500 transition-colors"
                                  aria-label="Remove row"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Section>

          </div>{/* /form body */}

          {/* ── Footer note ──────────────────────────────────────────── */}
          <div className="px-6 py-3 border-t border-gray-100 bg-blue-50/40">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Note: </span>
              On click <strong>Submit</strong> button detail gets submitted &amp; displayed in the grid.
              On click <strong>Cancel</strong> activity gets cancelled &amp; details will not be saved.
            </p>
          </div>

          {/* ── Action buttons ───────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSaveAsDraft}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit
            </Button>
          </div>

        </div>{/* /card */}
      </form>
    </div>
  );
};
