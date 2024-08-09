export type ProcurementPlanResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  description: string;
  approved_budget: number;
  pr_staff: string;
  mode_of_procurement: string;
  procurement_committee_review: string;
  procurement_process: string;
  donor_remarks: string;
  implenter_remarks: string;
  start_date: string;
  expected_delivery_date_1: string;
  expected_delivery_date_2: string;
  ware_houses: string;
  project: string;
  workplan_activity: string;
  financial_year: string;
  selected_supplier: string;
};

export interface ProcurementPlanData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: ProcurementPlanResultsData[];
}

export interface ProcurementPlanResponse {
  message: string;
  data: ProcurementPlanResultsData;
}
