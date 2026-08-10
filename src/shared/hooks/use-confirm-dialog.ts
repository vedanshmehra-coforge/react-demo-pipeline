import { useState, useCallback } from 'react';

type UseConfirmDialogReturn = {
  isOpen: boolean;
  open: (options?: ConfirmOptions) => void;
  close: () => void;
  confirm: () => void;
  options: ConfirmOptions;
};

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm?: () => void;
};

const DEFAULT_OPTIONS: ConfirmOptions = {
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'default',
};

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>(DEFAULT_OPTIONS);

  const open = useCallback((opts?: ConfirmOptions) => {
    setOptions({ ...DEFAULT_OPTIONS, ...opts });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const confirm = useCallback(() => {
    options.onConfirm?.();
    setIsOpen(false);
  }, [options]);

  return { isOpen, open, close, confirm, options };
};
