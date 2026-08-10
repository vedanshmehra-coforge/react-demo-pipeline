export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
  message: string;
  success: boolean;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SortParams = {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type SearchParams = {
  search?: string;
};

export type BaseQueryParams = PaginationParams & SortParams & SearchParams;

export type FilterParams<T extends object = object> = BaseQueryParams & T;
