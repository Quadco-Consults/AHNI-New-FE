export type PrequalificationCriteriaResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  stage: string;
};

export interface PrequalificationCriteriaData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: PrequalificationCriteriaResultsData[];
}

export interface PrequalificationCriteriaResponse {
  message: string;
  data: PrequalificationCriteriaResultsData;
}
