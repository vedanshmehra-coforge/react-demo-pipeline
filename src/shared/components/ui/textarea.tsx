import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={3}
      className={cn(
        'flex w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 resize-y',
        'placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
