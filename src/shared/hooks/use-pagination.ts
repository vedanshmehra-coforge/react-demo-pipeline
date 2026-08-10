import { useState, useCallback } from 'react';
import { PAGINATION_DEFAULTS } from '@shared/constants/app.constants';
import type { PaginationParams } from '@shared/types/api.types';

type UsePaginationReturn = PaginationParams & {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
};

export const usePagination = (
  initialPage = PAGINATION_DEFAULTS.PAGE,
  initialPageSize = PAGINATION_DEFAULTS.PAGE_SIZE,
): UsePaginationReturn => {
  const [page, setPageState] = useState<number>(initialPage);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const setPage = useCallback((newPage: number) => setPageState(newPage), []);

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize);
    setPageState(1);
  }, []);

  const reset = useCallback(() => {
    setPageState(initialPage);
    setPageSizeState(initialPageSize);
  }, [initialPage, initialPageSize]);

  return { page, pageSize, setPage, setPageSize, reset };
};
