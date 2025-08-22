export type RiskCategoriesResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};

export interface RiskCategoriesData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: RiskCategoriesResultsData[];
}

export interface RiskCategoriesResponse {
  message: string;
  data: RiskCategoriesResultsData;
}
