export interface TRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  category?: string;
  item_category?: string;
  item_type?: string;
}

export interface TResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface TPaginatedResponse<T> {
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
