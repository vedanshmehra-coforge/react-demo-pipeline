export type ID = string;

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

export type SoftDelete = {
  deletedAt: string | null;
};

export type BaseEntity = {
  id: ID;
} & Timestamps;

export type Status =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLOSED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'CANCELLED';

export type SortOrder = 'asc' | 'desc';

export type SelectOption<T = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type KeyValuePair = {
  key: string;
  value: string;
};

/** Utility — make specified keys required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Utility — deep partial */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
