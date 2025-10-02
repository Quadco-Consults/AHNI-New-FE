export type PurchaseRequestItems = {
  id: string;
  item: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    uom: string;
    category: string;
  };
  item_detail?: {
    id: string;
    name: string;
    description: string;
    uom: string;
    category: string;
  };
  created_at: string;
  updated_at: string;
  category: string;
  fco: string;
  fco_number?: string;
  activity_number?: string;
  fconumber?: string;
  fconumber_details?: Array<{
    id: string;
    module_code?: string;
    code?: string;
    name?: string;
  }>;
  units: number;
  number_of_days: number;
  unit_cost: number;
  quantity: number;
  sub_total_amount: number;
  amount?: number | string;
  amaount?: number | string;
  uom?: string;
  purchase_request: string;
  created_datetime: string;
};

export type PurchaseRequestResultsData = {
  id: string;
  items: PurchaseRequestItems[];
  created_at: string;
  updated_at: string;
  request_date: string;
  required_date: string;
  date_of_request?: string;
  date_required?: string;
  requested_date?: string;
  created_datetime: string;
  total_amount: number;
  request_id: string;
  title: string;
  status: string;
  request_memo?: string;
  requesting_department_detail: {
    name: string;
    id: string;
  };
  deliver_to_detail: {
    name: string;
    id: string;
  };
  requesting_department: string;
  location_detail: { name: string };
  ref_number: string;
  requested_by: {
    id: string;
    phone_number: string;
    gender: string;
    first_name: string;
    last_name: string;
    designation: string;
    email: string;
  };
  reviewed_by?: any;
  authorized_by?: any;
  approved_by?: any;
  reviewed_by_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  authorized_by_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  approved_by_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  reviewed_date?: string;
  authorized_date?: string;
  approved_date?: string;
  specification_document?: string;
};

export interface PurchaseRequestData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: PurchaseRequestResultsData[];
}

export interface PurchaseRequestResponse {
  message: string;
  data: PurchaseRequestResultsData;
}
// New types

// TypeScript Type Definition
export interface Expense {
  item: string;
  uom: string;
  quantity: number;
  unit_cost: string;
  total_cost: string;
  purchase_request_memo: string;
}

export interface RequestPayload {
  expenses: Expense[];
  activity: string;
  location: string;
  module: string;
  intervention: string;
  requested_date: string;
  comment: string;
  created_date: string;
  reviewed_date: string;
  approved_date: string;
  created_by: string;
  reviewed_by: string;
  approved_by: string;
  budget_line: string[];
  cost_grouping: string[];
  fconumber: string[];
  cost_input: string[];
  program_areas: string[];
  funding_source: string[];
}
