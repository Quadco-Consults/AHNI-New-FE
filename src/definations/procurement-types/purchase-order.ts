export type PurchaseOrderItems = {
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
  purchase_order: string;
};

export type PurchaseOrderResultsData = {
  id: string;
  items: PurchaseOrderItems[];
  created_at: string;
  updated_at: string;
  order_date: string;
  required_date: string;
  total_amount: number;
  order_id: string;
  status: string;
  ordering_department: string;
  deliver_to: string;
  ordered_by: {
    id: string;
    phone_number: string;
    gender: string;
    first_name: string;
    last_name: string;
    designation: string;
    email: string;
  };
};

export interface PurchaseOrderData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: PurchaseOrderResultsData[];
}

export interface PurchaseOrderResponse {
  message: string;
  data: PurchaseOrderResultsData;
}
