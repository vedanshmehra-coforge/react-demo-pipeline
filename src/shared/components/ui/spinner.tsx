import { cn } from '@shared/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <span
    role="status"
    aria-label="Loading"
    className={cn(
      'inline-block border-2 border-current border-t-transparent rounded-full animate-spin text-blue-600',
      sizes[size],
      className,
    )}
  />
);
