import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
        'placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error
          ? 'border-red-400 focus:ring-red-400'
          : 'border-gray-300',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
