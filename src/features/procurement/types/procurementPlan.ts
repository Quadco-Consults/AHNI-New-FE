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
    name?: string;
    description: string;
    code?: string;
    serial_number?: string;
    job_category?: string;
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
  purchase_request_value?: number;
  procurement_officer?: string;
  item_category?: string;
  item_type?: string;
  is_service?: boolean;
  vendor_evaluation_status?: 'RETAINED' | 'BARRED' | 'PROBATION' | 'PENDING';
  vendor_performance_score?: number;
  actual_payment_amount?: number;
  payment_date?: string;
  solicitation: {
    id: string;
    solicitaion_ref: string;
    lot: string;
    opening_date: string;
    request_type: string;
    tender_type: string;
    status: string;
    date_procurement_initiated?: string;
  };
  purchase_order: {
    id: string;
    po_reference: string;
    po_date: string;
    vendor: string;
    vendor_name?: string;
    status: string;
    unit_cost: number;
    quantity: number;
    sub_total_amount: number;
    fco: string;
    fco_number?: string;
    delivery_due_date?: string;
    uom?: string;
    service_quality_rating?: number;
    date_of_grn?: string;
    date_of_service_delivery?: string;
    grn_details?: {
      grn_number?: string;
      invoice_number?: string;
      waybill_number?: string;
      accepted_by_name?: string;
      accepted_datetime?: string;
    };
    service_delivery_details?: {
      delivery_status?: string;
    };
  };
  delivery_note?: {
    grn_number?: string;
    date_received?: string;
    delivery_date?: string;
    grn_reference?: string;
  };
};
