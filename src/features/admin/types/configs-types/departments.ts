export type DepartmentsResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};

export interface DepartmentsData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: DepartmentsResultsData[];
}

export interface DepartmentsResponse {
  message: string;
  data: DepartmentsResultsData;
}