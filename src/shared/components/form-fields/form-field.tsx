import type { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const FormField = ({
  label, htmlFor, error, hint, required, children, className,
}: FormFieldProps) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-gray-700"
    >
      {label}
      {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="text-xs text-gray-500">{hint}</p>
    )}
    {error && (
      <p className="text-xs text-red-600" role="alert">{error}</p>
    )}
  </div>
);
