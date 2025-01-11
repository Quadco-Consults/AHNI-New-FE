export interface TRequest {
  page?: number;
  size?: number;
  params?: { status: string };
}

export interface TResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface TPaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number: number | null;
      previous: number | null;
      previous_page_number: number | null;
    };
    results: T[];
  };
}
