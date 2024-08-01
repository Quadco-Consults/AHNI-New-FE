export type SolicitationItems = {
  id: string;
  created_at: string;
  updated_at: string;
  quantity: number;
  item: string;
  solicitation: string;
  lot: number;
};
export type SolicitationCriteria = {
  id: string;
  created_at: string;
  updated_at: string;
  solicitation: string;
  criteria: string;
};

export type SolicitationResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  name: string;
  description: string;
  opening_date: string;
  closing_date: string;
  document: string;
  tender_type: string;
  request_type: string;
  limited_vendors: string;
  items: SolicitationItems[];
  criteria: SolicitationCriteria[];
  reference: string;
  purchase_request: string;
};

export interface SolicitationData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: SolicitationResultsData[];
}

export interface SolicitationResponse {
  message: string;
  data: SolicitationResultsData;
}
