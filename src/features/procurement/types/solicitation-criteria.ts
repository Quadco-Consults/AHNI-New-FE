export type SolicitationCriteriaResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  solicitation: string;
  criteria: string;
};

export interface SolicitationCriteriaData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: SolicitationCriteriaResultsData[];
}

export interface SolicitationResponse {
  message: string;
  data: SolicitationCriteriaResultsData;
}
