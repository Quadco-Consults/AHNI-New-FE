export type ProcurementPlanResultsData = {
  id?: string;
  created_at?: string;
  updated_at?: string;
  project?: string;
  financial_year?: string;
  budget_line?: string;
  implementer?: string;
  implementation_location?: string;
  workplan_activity_reference?: string;
  workplan_activity_object?: {
    id: string;
    description: string;
  };
  description?: string;
  approved_budget?: number;
  pr_staff?: string;
  mode_of_procurement?: string;
  procurement_committee_review?: string;
  is_ppm?: boolean;
  procurement_process?: string;
  donor_remarks?: string;
  implenter_remarks?: string;
  start_date?: string;
  expected_delivery_date_1?: string;
  expected_delivery_date_2?: string;
  ware_houses?: string;
  workplan_activity?: string;
  selected_supplier?: string;
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

export type ProcurementTrackerResults = {
  id: string;
  pr_reference: string;
  item_name: string;
  quantity: number;
  request_date: string;
  required_date: string;
  deparment: string;
  solicitation: {
    id: string;
    solicitaion_ref: string;
    lot: string;
    opening_date: string;
    request_type: string;
    tender_type: string;
    status: string;
  };
  purchse_order: {
    id: string;
    po_reference: string;
    po_date: string;
    vendor: string;
    status: string;
    unit_cost: number;
    quantity: number;
    sub_total_amount: number;
    fco: string;
  };
};
