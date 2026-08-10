import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { DATE_FORMATS } from '@shared/constants/app.constants';

// ── Date formatters ──────────────────────────────────────────────────────────

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, DATE_FORMATS.DISPLAY) : '—';
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, DATE_FORMATS.DISPLAY_WITH_TIME) : '—';
};

export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—';
};

export const formatApiDate = (date: Date): string => format(date, DATE_FORMATS.API);

// ── Currency ─────────────────────────────────────────────────────────────────

export const formatCurrency = (
  amount: number | null | undefined,
  currency = 'INR',
): string => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ── Numbers ──────────────────────────────────────────────────────────────────

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
};

export const formatPercent = (value: number | null | undefined, decimals = 1): string => {
  if (value == null) return '—';
  return `${value.toFixed(decimals)}%`;
};

// ── String ───────────────────────────────────────────────────────────────────

export const truncate = (str: string, maxLength: number): string =>
  str.length <= maxLength ? str : `${str.slice(0, maxLength)}…`;

export const toTitleCase = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
