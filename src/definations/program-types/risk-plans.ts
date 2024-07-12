export interface RiskCategory {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
}
export interface RiskOwner {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
}

export interface RiskPlansResultsData {
  id: string;
  created_at: string;
  updated_at: string;
  risk_number: string;
  risk_description: string;
  impact_description: string;
  impact_level: string;
  occurrence_probability: string;
  total_risk_response: string;
  risk_response: string;
  implementation_timeline: string;
  risk_status: string;
  risk_category: RiskCategory;
  risk_owner: RiskOwner;
}

export interface RiskPlansData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: RiskPlansResultsData[];
}

export interface RiskPlansResponse {
  message: string;
  data: RiskPlansResultsData;
}
