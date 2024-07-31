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
  created_at: string;
  updated_at: string;
  category: string;
  fco: string;
  units: number;
  number_of_days: number;
  unit_cost: number;
  quantity: number;
  sub_total_amount: number;
  purchase_request: string;
};

export type PurchaseRequestResultsData = {
  id: string;
  items: PurchaseRequestItems[];
  created_at: string;
  updated_at: string;
  request_date: string;
  required_date: string;
  total_amount: number;
  request_id: string;
  status: string;
  requesting_department: string;
  deliver_to: string;
  requested_by: {
    id: string;
    phone_number: string;
    gender: string;
    first_name: string;
    last_name: string;
    designation: string;
    email: string;
  };
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
