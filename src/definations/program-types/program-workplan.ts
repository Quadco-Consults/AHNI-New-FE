export interface WorkPlanResultsData {
  id: string;
  monthly_budget: {
    month: string;
    frequency: number;
    monthly_total: number;
  }[];
  annual_total_in_ngn: string;
  created_at: string;
  updated_at: string;
  identification: string;
  description: string;
  activity_justification: string;
  lead_department: string;
  lead_person: string;
  unit_cost_ngn: number;
  expected_result: string;
  indicator: string;
  mov: string;
  locations: string;
  approval_number: string;
  comments: string;
  financial_year: string;
  project_objective: string;
  partner: string;
  project: string;
}

export interface WorkPlanData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: WorkPlanResultsData[];
}

export interface WorkPlanResponse {
  message: string;
  data: WorkPlanData;
}
export interface WorkPlanCreateResponse {
  message: string;
  data: WorkPlanResultsData;
}
