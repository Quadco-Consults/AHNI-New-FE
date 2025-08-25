export interface ManualBidCbaPrequalificationData {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ManualBidCbaPrequalificationResponse {
  success: boolean;
  message: string;
  data: ManualBidCbaPrequalificationData;
}

export interface ManualBidCbaPrequalificationResultsData {
  results: ManualBidCbaPrequalificationData[];
  count: number;
  next?: string;
  previous?: string;
}
