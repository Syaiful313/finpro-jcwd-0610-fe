export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PageableResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQueries {
  take?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: string;
}
