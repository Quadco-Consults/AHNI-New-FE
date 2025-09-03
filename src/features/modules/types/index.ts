// Base API response interfaces
export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  number_of_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    next: string | null;
    next_page_number: number | null;
    previous: string | null;
    previous_page_number: number | null;
  };
}

export interface FilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  category?: string;
  category__job_category?: string;
}

// Standard CRUD response types
export interface CrudResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Re-export from legacy definitions for backward compatibility
export type TRequest = FilterParams;
export type TResponse<T> = CrudResponse<T>;
export type TPaginatedResponse<T> = PaginatedResponse<T>;

// Export domain-specific types
export * from "./admin";
export * from "./cg";
export * from "./config";
export * from "./finance";
export * from "./procurement";
export * from "./program";
export * from "./project";
