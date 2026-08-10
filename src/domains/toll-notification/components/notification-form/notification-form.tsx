import { useState } from 'react';
import { useForm, useFieldArray, Controller, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Info, Upload, X, FileText } from 'lucide-react';
import { Button }      from '@shared/components/ui/button';
import { Input }       from '@shared/components/ui/input';
import { Select }      from '@shared/components/ui/select';
import { FormField }   from '@shared/components/form-fields/form-field';
import { SectionCard } from '@shared/components/layout/section-card';
import {
  createTollNotificationSchema,
  TOLL_MODES, PLAZA_TYPES,
  PUBLIC_FUNDED_SUB_TYPES,
  CONCESSIONAIRE_SUB_TYPES,
  type CreateTollNotificationFormValues,
} from '../../validation/toll-notification.schema';
import type { TollNotification } from '../../types/toll-notification.types';

interface NotificationFormProps {
  defaultValues?:   Partial<TollNotification>;
  onSaveDraft:      (v: CreateTollNotificationFormValues) => void;
  onSubmit:         (v: CreateTollNotificationFormValues) => void;
  isSaving?:        boolean;
  isSubmitting?:    boolean;
  onCancel:         () => void;
  rejectionRemarks?: string | null;
}

const PLAZA_TYPE_OPTIONS = PLAZA_TYPES.map((t) => ({ value: t, label: t }));

const BLANK_PLAZA: CreateTollNotificationFormValues['tollPlazas'][number] = {
  nameOfTollPlaza: '', locationOfTollPlaza: '', noOfTollLane: '',
  tempTollPlazaId: '', permanentTollPlazaId: '',
  tollPlazaCfy: '', trafficSurveyDate: '', tollPlazaApc: '',
};

export const NotificationForm = ({
  defaultValues, onSaveDraft, onSubmit, isSaving, isSubmitting, onCancel, rejectionRemarks,
}: NotificationFormProps) => {
  const [eOfficeVerified, setEOfficeVerified] = useState(false);

  const form = useForm<CreateTollNotificationFormValues>({
    resolver: zodResolver(createTollNotificationSchema),
    defaultValues: {
      tollMode:    defaultValues?.tollMode    ?? 'New Toll Plaza',
      upc:         defaultValues?.upc         ?? '',
      projectName: defaultValues?.projectName ?? '',
      piuName:     defaultValues?.piuName     ?? '',
      roName:      defaultValues?.roName      ?? '',
      plazaType:   defaultValues?.plazaType   ?? 'Public Funded',
      tollSubType: (defaultValues as CreateTollNotificationFormValues | undefined)?.tollSubType ?? '',
      tollingNotApplicable:        defaultValues?.tollingNotApplicable        ?? false,
      tollingNotApplicableRemarks: defaultValues?.tollingNotApplicableRemarks ?? '',
      appointedDate:        defaultValues?.appointedDate        ?? '',
      likelyCompletionDate: defaultValues?.likelyCompletionDate ?? '',
      physicalProgress:     defaultValues?.physicalProgress     ?? '',
      eOfficeFileNo:  defaultValues?.eOfficeFileNo  ?? '',
      eOfficeSubject: defaultValues?.eOfficeSubject ?? '',
      documentName:   defaultValues?.documentName   ?? '',
      tollPlazas: defaultValues?.tollPlazas?.map((p) => ({
        nameOfTollPlaza:      p.nameOfTollPlaza,
        locationOfTollPlaza:  p.locationOfTollPlaza,
        noOfTollLane:         p.noOfTollLane,
        tempTollPlazaId:      p.tempTollPlazaId,
        permanentTollPlazaId: p.permanentTollPlazaId,
        tollPlazaCfy:         p.tollPlazaCfy,
        trafficSurveyDate:    p.trafficSurveyDate,
        tollPlazaApc:         p.tollPlazaApc,
      })) ?? [{ ...BLANK_PLAZA }],
      lengthDetails: defaultValues?.lengthDetails ?? {
        netRoadLength2L: '', netRoadLength4L: '',
        netBypassLength2L: '', netBypassLength4L: '',
        netStructureLength2L: '', netStructureLength4L: '',
        projectLength: '', projectInfluenceLength: '',
      },
    },
  });

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'tollPlazas' });
  const tollingNA   = watch('tollingNotApplicable');
  const plazaType   = watch('plazaType');
  const tollSubType = watch('tollSubType');
  const tollMode    = watch('tollMode');
  const isTransferred = tollMode === 'Transferred Toll Plaza';

  // Reset tollSubType whenever plazaType changes
  const handlePlazaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('plazaType', e.target.value as 'Public Funded' | 'Concessionaire');
    setValue('tollSubType', '');
  };

  const subTypeOptions =
    plazaType === 'Public Funded'
      ? PUBLIC_FUNDED_SUB_TYPES.map((t) => ({ value: t, label: t }))
      : CONCESSIONAIRE_SUB_TYPES.map((t) => ({ value: t, label: t }));

  const doSaveDraft  = handleSubmit((v) => onSaveDraft(v));
  const doSubmit     = handleSubmit((v) => onSubmit(v));

  return (
   <div className={isTransferred ? 'grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 items-stretch' : 'space-y-4'}>
    {/* ── Left: main form ──────────────────────────────────────────────────── */}
    <div className={`${isTransferred ? 'lg:col-span-3' : ''} space-y-4`}>
      {/* Rejection banner */}
      {rejectionRemarks && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-0.5">This notification was rejected</p>
            <p className="text-sm text-red-600">{rejectionRemarks}</p>
          </div>
        </div>
      )}

      {/* ── Header section ───────────────────────────────────────────────── */}
      <SectionCard>
        <div className="bg-[#1a2238] text-white text-sm font-bold px-4 py-2.5 rounded-lg mb-4">
          Toll Notification
        </div>

        {/* Toll Mode */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">For Toll Plaza</p>
          <Controller control={control} name="tollMode" render={({ field }) => (
            <div className="flex gap-6">
              {TOLL_MODES.map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="radio" value={m} checked={field.value === m}
                    onChange={() => field.onChange(m)} className="accent-blue-600" />
                  {m}
                </label>
              ))}
            </div>
          )} />
        </div>

        {/* UPC + Project Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormField label="UPC" htmlFor="upc" error={errors.upc?.message} required>
            <Input id="upc" placeholder="e.g. N/01001/05003/GJ" error={!!errors.upc} {...register('upc')} />
          </FormField>
          <FormField label="Project Name" htmlFor="projectName" error={errors.projectName?.message} required>
            <div className="flex gap-2">
              <Input id="projectName" placeholder="Autofill from UPC / Enter manually"
                error={!!errors.projectName} {...register('projectName')} />
              <span className="text-xs text-gray-400 self-center whitespace-nowrap">↓ Autofill</span>
            </div>
          </FormField>
        </div>

        {/* PIU + RO — hidden for Transferred Toll Plaza */}
        {!isTransferred && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormField label="PIU" htmlFor="piuName" error={errors.piuName?.message} required>
            <Input id="piuName" placeholder="e.g. Vadodara" error={!!errors.piuName} {...register('piuName')} />
          </FormField>
          <FormField label="RO" htmlFor="roName" error={errors.roName?.message} required>
            <Input id="roName" placeholder="e.g. RO-Gandhinagar" error={!!errors.roName} {...register('roName')} />
          </FormField>
        </div>
        )}

        {/* Tolling not applicable — hidden for Transferred Toll Plaza */}
        {!isTransferred && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-gray-700">Select "Yes" if tolling not applicable for this project:</p>
            <Controller control={control} name="tollingNotApplicable" render={({ field }) => (
              <div className="flex gap-4">
                {([{ v: true, l: 'Yes' }, { v: false, l: 'No' }] as const).map(({ v, l }) => (
                  <label key={l} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" checked={field.value === v}
                      onChange={() => field.onChange(v)} className="accent-blue-600" />
                    {l}
                  </label>
                ))}
              </div>
            )} />
          </div>
          {tollingNA && (
            <div className="mt-3">
              <FormField label="Remarks" htmlFor="naRemarks">
                <Input id="naRemarks" placeholder="Enter remarks for non-applicability"
                  {...register('tollingNotApplicableRemarks')} />
              </FormField>
            </div>
          )}
        </div>
        )}

        {/* Dates + Progress — hidden for Transferred Toll Plaza */}
        {!isTransferred && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <FormField label="Appointed Date" htmlFor="appointedDate">
            <Input id="appointedDate" placeholder="Autofill" readOnly
              className="bg-gray-50" {...register('appointedDate')} />
          </FormField>
          <FormField label="Likely / Schedule Completion Date" htmlFor="likelyCompletionDate">
            <Input id="likelyCompletionDate" placeholder="Autofill" readOnly
              className="bg-gray-50" {...register('likelyCompletionDate')} />
          </FormField>
          <FormField label="Physical Progress (%)" htmlFor="physicalProgress">
            <Input id="physicalProgress" placeholder="Autofill" readOnly
              className="bg-gray-50" {...register('physicalProgress')} />
          </FormField>
        </div>
        )}

        {/* Plaza Type + Sub-Type (DDL) + Notification Letter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <FormField label="Plaza Type" htmlFor="plazaType">
            <select
              id="plazaType"
              value={plazaType}
              onChange={handlePlazaTypeChange}
              className="flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PLAZA_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>

          <FormField
            label={plazaType === 'Public Funded' ? 'Public Funded / Concessionaire' : 'Concessionaire Type'}
            htmlFor="tollSubType"
          >
            <Select
              id="tollSubType"
              placeholder="Select type"
              options={subTypeOptions}
              value={tollSubType}
              onChange={(e) => setValue('tollSubType', e.target.value)}
            />
          </FormField>

          <FormField label="Toll Notification Information Letter" htmlFor="documentName">
            <FileUploadField
              id="documentName"
              currentFileName={watch('documentName')}
              onFileSelect={(fileName) => setValue('documentName', fileName)}
              onClear={() => setValue('documentName', '')}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </FormField>
        </div>

        {/* E-Office section — hidden for Transferred Toll Plaza */}
        {!isTransferred && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              E-Office/Computer Number must be verified by PIU before submission.
              CO-Division will also verify after submission.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="E-Office File No. / Computer No."
              htmlFor="eOfficeFileNo" error={errors.eOfficeFileNo?.message} required>
              <div className="flex gap-2">
                <Input id="eOfficeFileNo" placeholder="e.g. NHAI/-001.OAGA"
                  error={!!errors.eOfficeFileNo} {...register('eOfficeFileNo')} />
                <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                  <input type="checkbox" checked={eOfficeVerified}
                    onChange={(e) => setEOfficeVerified(e.target.checked)}
                    className="accent-blue-600 w-4 h-4" />
                  <span className="text-xs text-gray-600 whitespace-nowrap">Verify / Change</span>
                </label>
              </div>
            </FormField>
            <FormField label="E-File Subject" htmlFor="eOfficeSubject">
              <Input id="eOfficeSubject" placeholder="Autofill" readOnly
                className="bg-gray-50" {...register('eOfficeSubject')} />
            </FormField>
          </div>
        </div>
        )}
      </SectionCard>

      {/* ── Toll Plaza sub-table ─────────────────────────────────────────── */}
      <SectionCard
        title="Detail of Toll Plazas Where Toll Notification is to be Issued"
        actions={
          <Button type="button" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => append({ ...BLANK_PLAZA })}>
            ADD
          </Button>
        }
      >
        {(errors.tollPlazas as { root?: { message?: string } } | undefined)?.root?.message && (
          <p className="text-xs text-red-600 mb-2">
            {(errors.tollPlazas as { root?: { message?: string } }).root?.message}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <Th2>S.No.</Th2>
                <Th2 required>Name of Toll Plaza</Th2>
                <Th2 required>Location of Toll Plaza</Th2>
                <Th2 required>No. of Toll Lanes</Th2>
                <Th2 required>{isTransferred ? 'Permanent Toll Plaza ID' : 'Temporary Toll Plaza ID'}</Th2>
                <Th2>Toll Plaza Traffic (PCU) for CFY</Th2>
                <Th2>Traffic Survey Date</Th2>
                <Th2>Toll Plaza APC</Th2>
                <th className="px-2 py-2.5 w-8" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => {
                const e = errors.tollPlazas?.[idx];
                return (
                  <tr key={field.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-center text-gray-500 font-medium">{idx + 1}</td>
                    <td className="px-2 py-1.5">
                      <Input placeholder="Plaza name" error={!!e?.nameOfTollPlaza}
                        {...register(`tollPlazas.${idx}.nameOfTollPlaza`)} />
                      {e?.nameOfTollPlaza && (
                        <p className="text-[10px] text-red-500 mt-0.5">{e.nameOfTollPlaza.message}</p>
                      )}
                    </td>
                    <td className="px-2 py-1.5">
                      <Input placeholder="Location / Chainage" error={!!e?.locationOfTollPlaza}
                        {...register(`tollPlazas.${idx}.locationOfTollPlaza`)} />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input placeholder="e.g. 8L" error={!!e?.noOfTollLane}
                        {...register(`tollPlazas.${idx}.noOfTollLane`)} />
                    </td>
                    <td className="px-2 py-1.5">
                      {isTransferred ? (
                        <Input placeholder="Permanent ID"
                          {...register(`tollPlazas.${idx}.permanentTollPlazaId`)} />
                      ) : (
                        <Input placeholder="Temp ID" error={!!e?.tempTollPlazaId}
                          {...register(`tollPlazas.${idx}.tempTollPlazaId`)} />
                      )}
                    </td>
                    <td className="px-2 py-1.5">
                      <Input placeholder="PCU" {...register(`tollPlazas.${idx}.tollPlazaCfy`)} />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input type="date" {...register(`tollPlazas.${idx}.trafficSurveyDate`)} />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input placeholder="APC ₹ Cr." {...register(`tollPlazas.${idx}.tollPlazaApc`)} />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(idx)}
                          className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ── Project / Bypass Length Details ─────────────────────────────── */}
      <SectionCard title="Project / Bypass Length Details (As per Fee Notification)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <Th2>S.No.</Th2>
                <Th2>Length Type</Th2>
                <Th2>2L + PS (Kms)</Th2>
                <Th2>4L &amp; More (Kms)</Th2>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <LengthRow sno={1} label="Net Road Length (as per Fee Notification)"
                field2L="netRoadLength2L" field4L="netRoadLength4L" register={register} />
              <LengthRow sno={2} label="Net Bypass Length (as per Fee Notification)"
                field2L="netBypassLength2L" field4L="netBypassLength4L" register={register} />
              <LengthRow sno={3} label="Net Structure Length (as per Fee Notification)"
                field2L="netStructureLength2L" field4L="netStructureLength4L" register={register} />
              <tr className="bg-gray-50">
                <td className="px-3 py-2 text-gray-500">4</td>
                <td className="px-3 py-2 text-gray-700 font-medium">Project Length</td>
                <td colSpan={2} className="px-3 py-2">
                  <Input placeholder="Autofill" readOnly className="bg-gray-100 max-w-[180px]"
                    {...register('lengthDetails.projectLength')} />
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 text-gray-500">5</td>
                <td className="px-3 py-2 text-gray-700 font-medium">Project Influence Length</td>
                <td colSpan={2} className="px-3 py-2">
                  <Input placeholder="Autofill" readOnly className="bg-gray-100 max-w-[180px]"
                    {...register('lengthDetails.projectInfluenceLength')} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ── Form actions ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isSubmitting}>
          Cancel
        </Button>
        <Button type="button" variant="secondary" loading={isSaving} disabled={isSubmitting}
          onClick={doSaveDraft}>
          Save as Draft
        </Button>
        <Button type="button" variant="primary" loading={isSubmitting}
          disabled={isSaving || (!isTransferred && !eOfficeVerified)}
          title={!isTransferred && !eOfficeVerified ? 'Tick "Verify / Change" checkbox first' : undefined}
          onClick={doSubmit}>
          Submit
        </Button>
      </div>
    </div>{/* end left form column */}

   

    </div>
  );
};

// ─── Table helpers ────────────────────────────────────────────────────────────

const Th2 = ({ children, required }: { children?: React.ReactNode; required?: boolean }) => (
  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </th>
);

type LengthKey = keyof CreateTollNotificationFormValues['lengthDetails'];

interface LengthRowProps {
  sno:      number;
  label:    string;
  field2L:  LengthKey;
  field4L:  LengthKey;
  register: UseFormRegister<CreateTollNotificationFormValues>;
}

const LengthRow = ({ sno, label, field2L, field4L, register }: LengthRowProps) => (
  <tr>
    <td className="px-3 py-2 text-gray-500">{sno}</td>
    <td className="px-3 py-2 text-gray-700">{label}</td>
    <td className="px-2 py-1.5">
      <Input placeholder="Kms" className="max-w-[120px]"
        {...register(`lengthDetails.${field2L}`)} />
    </td>
    <td className="px-2 py-1.5">
      <Input placeholder="Kms" className="max-w-[120px]"
        {...register(`lengthDetails.${field4L}`)} />
    </td>
  </tr>
);

// ─── File Upload Field ────────────────────────────────────────────────────────

interface FileUploadFieldProps {
  id: string;
  currentFileName: string;
  onFileSelect: (fileName: string) => void;
  onClear: () => void;
  accept?: string;
}

const FileUploadField = ({
  id, currentFileName, onFileSelect, onClear, accept = '.pdf,.doc,.docx',
}: FileUploadFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file.name);
    // Reset input so the same file can be re-selected if cleared
    e.target.value = '';
  };

  if (currentFileName) {
    return (
      <div className="flex items-center gap-2 h-9 px-3 border border-gray-300 rounded-lg bg-green-50">
        <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span className="text-sm text-gray-700 truncate flex-1" title={currentFileName}>
          {currentFileName}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-gray-400 hover:text-red-500 flex-shrink-0"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 h-9 px-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-colors"
    >
      <Upload className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-500">Choose file…</span>
      <span className="text-xs text-gray-400 ml-auto">{accept.replace(/\./g, '').replace(/,/g, ', ')}</span>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
    </label>
  );
};
