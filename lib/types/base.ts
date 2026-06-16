import { ErrorCode } from '@lib/constants/error-code';

// Common API response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common error response
export interface ApiError {
  message: string;
  statusCode: number;
  errCode?: ErrorCode | null;
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Generic ID type
export type ID = string | number;
