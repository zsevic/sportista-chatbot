export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total: number;
}
