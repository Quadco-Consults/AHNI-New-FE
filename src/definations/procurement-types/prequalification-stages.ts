export type PrequalificationStagesResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};

export interface PrequalificationStagesData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: PrequalificationStagesResultsData[];
}

export interface PrequalificationStagesResponse {
  message: string;
  data: PrequalificationStagesResultsData;
}
