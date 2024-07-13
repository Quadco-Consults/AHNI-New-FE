export type FundingSourceResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};

export interface FundingSourceData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: FundingSourceResultsData[];
}

export interface FundingSourceResponse {
  message: string;
  data: FundingSourceResultsData;
}
