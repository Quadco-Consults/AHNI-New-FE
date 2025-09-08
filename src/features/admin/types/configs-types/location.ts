export type LocationResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  address: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  unique_code?: string;
};

export interface LocationData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: LocationResultsData[];
}

export interface LocationResponse {
  message: string;
  data: LocationResultsData;
}