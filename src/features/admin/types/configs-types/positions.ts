export type PositionsResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};

export interface PositionsData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: PositionsResultsData[];
}

export interface PositionsResponse {
  message: string;
  data: PositionsResultsData;
}