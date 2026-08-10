import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button }    from '@shared/components/ui/button';
import { Textarea }  from '@shared/components/ui/textarea';
import { FormField } from '@shared/components/form-fields/form-field';
import { rejectSchema, type RejectFormValues } from '../../validation/toll-notification.schema';

interface RejectModalProps {
  upc: string;
  onConfirm: (remarks: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const RejectModal = ({ upc, onConfirm, onClose, isLoading }: RejectModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reject Notification</h3>
            <p className="text-sm text-gray-500 mt-0.5">{upc}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit((v) => onConfirm(v.rejectionRemarks))} noValidate className="space-y-4">
          <FormField label="Reason for Rejection" htmlFor="rejectionRemarks" error={errors.rejectionRemarks?.message} required hint="Min 10 characters — visible to PIU">
            <Textarea id="rejectionRemarks" rows={4} placeholder="Provide a clear reason..." error={!!errors.rejectionRemarks} {...register('rejectionRemarks')} />
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" variant="danger" loading={isLoading}>Confirm Rejection</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
