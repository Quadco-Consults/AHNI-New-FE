export type ProcurementPlanLineItem = {
  id?: string;
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
  items?: ProcurementPlanLineItem[];
  line_items?: ProcurementPlanLineItem[];
  procurement_items?: ProcurementPlanLineItem[];
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
  pr_id?: string;
  donor?: string;
  project?: string;
  location?: string;
  program_requesting?: string;
  activity?: string;
  item_name: string;
  item_category?: string;
  item_type?: string;
  is_service?: boolean;
  quantity: number;
  uom?: string;
  request_date: string;
  date_goods_required?: string;  // Backend field name
  required_date?: string;  // Alias for compatibility
  department?: string;
  deparment?: string;  // Typo in backend, keep for compatibility
  purchase_request_value?: number;
  procurement_officer?: string;
  remarks?: string;

  // Vendor evaluation fields (may be nested or at root level)
  vendor_evaluation_status?: 'RETAINED' | 'BARRED' | 'PROBATION' | 'PENDING';
  vendor_performance_score?: number;
  vendor_performance?: {
    status: 'EVALUATED' | 'PENDING' | 'NOT_EVALUATED' | 'N/A';
    total_score?: number;
    recommendation?: string;
    evaluation_date?: string;
    service?: string;
    vendor_name?: string;
    message?: string;
  };

  // Payment fields (extracted from purchase_order.payment_request)
  actual_payment_amount?: number;
  payment_date?: string;

  solicitation?: {
    id: string;
    solicitaion_ref: string;
    lot?: string;
    opening_date?: string;
    request_type?: string;
    tender_type?: string;
    status?: string;
    date_procurement_initiated?: string;
  };

  purchase_order?: {
    id: string;
    po_reference: string;
    po_date: string;
    vendor: string;
    vendor_name?: string;
    status: string;
    unit_price?: number;
    unit_cost?: number;  // Alias
    quantity: number;
    total_price?: number;
    sub_total_amount?: number;  // Alias for total_price
    fco?: string;
    fco_number?: string;
    delivery_due_date?: string;
    uom?: string;
    service_quality_rating?: number;
    service_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
    date_of_grn?: string;
    date_of_service_delivery?: string;
    grn_details?: {
      id?: string;
      grn_number?: string;
      grn_reference?: string;
      invoice_number?: string;
      waybill_number?: string;
      accepted_by_name?: string;
      accepted_datetime?: string;
      rejected_by_name?: string;
      rejected_datetime?: string;
      remark?: string;
    };
    service_delivery_details?: {
      delivery_status?: string;
    };
    payment_request?: {
      id: string;
      payment_type: string;
      payment_date: string;
      total_amount: number;
      payment_reason?: string;
      status: string;
      requested_by?: string;
      created_datetime?: string;
      document_url?: string;
      approvals?: Array<{
        level: string;
        approval_level: number;
        user?: string;
        comments?: string;
        created_datetime?: string;
      }>;
    };
  };

  delivery_note?: {
    grn_number?: string;
    date_received?: string;
    delivery_date?: string;
    grn_reference?: string;
  };

  po_items?: Array<{
    id: string;
    item_name?: string;
    quantity?: number;
    unit_price?: number;
    total_price?: number;
  }>;
};
