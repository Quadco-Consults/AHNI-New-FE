export interface Line_Items {
  id: string;
  amount: string;
  description: string;
  unit_cost: string;
  frequency: string;
  comments: string;
}

export interface FundRequestResultsData {
  id: string;
  created_at: string;
  updated_at: string;
  line_items: Line_Items[];
  amount: string;
  financial_year: string;
  month_year: string;
  type: string;
  unique_identifier_code: string;
  currency: string;
  partner: string;
  project: string;
}

export interface FundRequestData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: FundRequestResultsData[];
}

export interface FundRequestResponse {
  message: string;
  data: FundRequestResultsData;
}
