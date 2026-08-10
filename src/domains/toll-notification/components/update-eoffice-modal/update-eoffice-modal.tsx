import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Info } from 'lucide-react';
import { Button }    from '@shared/components/ui/button';
import { Input }     from '@shared/components/ui/input';
import { FormField } from '@shared/components/form-fields/form-field';
import { updateEOfficeSchema, type UpdateEOfficeFormValues } from '../../validation/toll-notification.schema';
import type { TollNotification } from '../../types/toll-notification.types';

interface UpdateEOfficeModalProps {
  notification: TollNotification;
  onConfirm: (dto: UpdateEOfficeFormValues) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const UpdateEOfficeModal = ({ notification, onConfirm, onClose, isLoading }: UpdateEOfficeModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateEOfficeFormValues>({
    resolver: zodResolver(updateEOfficeSchema),
    defaultValues: { divEfileNum: notification.divEfileNum ?? '', coFileStatus: 'Verified' },
  });

  const doConfirm = handleSubmit((data) => onConfirm(data));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 z-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Update E-Office File Number</h3>
            <p className="text-sm text-gray-500 mt-0.5">{notification.upc} — {notification.piuName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 font-medium mb-1">PIU E-File No. (submitted by PIU)</p>
          <p className="text-sm font-mono font-semibold text-gray-800">{notification.eOfficeFileNo || '(not provided)'}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            Verify and enter the CO E-Office File Number. After this step, you can add the S.O. Number.
          </p>
        </div>

        <form onSubmit={doConfirm} noValidate className="space-y-4">
          <FormField label="CO E-Office File No." htmlFor="divEfileNum" error={errors.divEfileNum?.message} required>
            <Input id="divEfileNum" placeholder="e.g. 316221" error={!!errors.divEfileNum} {...register('divEfileNum')} />
          </FormField>

          <FormField label="CO File Status" htmlFor="coFileStatus">
            <Input id="coFileStatus" placeholder="e.g. Verified" {...register('coFileStatus')} />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" loading={isLoading}>Update E-Office Number</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
