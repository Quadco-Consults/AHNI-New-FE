export type BeneficiariesResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};

export interface BeneficiariesData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: BeneficiariesResultsData[];
}

export interface BeneficiariesResponse {
  message: string;
  data: BeneficiariesData;
}
