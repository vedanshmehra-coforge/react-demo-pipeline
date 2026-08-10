import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely, resolving conflicts.
 * Use this everywhere instead of raw template strings.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
