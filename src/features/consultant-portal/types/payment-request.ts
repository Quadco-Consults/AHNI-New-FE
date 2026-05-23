export interface PaymentRequest {
  id: string;
  payment_type: string;
  payment_date: string;
  payment_reason: string;
  total_amount: number;
  status: 'PENDING' | 'REVIEWED' | 'AUTHORIZED' | 'APPROVED' | 'REJECTED';
  document: string | null;
  number?: string;
  created_at: string | null;
  requested_by: string | null;
}

export interface PaymentRequestDetail extends PaymentRequest {
  requested_by: {
    id: string;
    name: string;
    email: string;
  } | null;
  items: PaymentRequestItem[];
  approvals: PaymentRequestApproval[];
}

export interface PaymentRequestItem {
  id: string;
  payment_to: string;
  amount_in_figures: number;
  amount_in_words: string;
  account_number: string;
  bank_name: string;
  tax_identification_number: string;
}

export interface PaymentRequestApproval {
  approval_level: string;
  user: string | null;
  comments: string;
  created_at: string | null;
}

export interface PaymentRequestStatistics {
  total_requests: number;
  pending: number;
  reviewed: number;
  authorized: number;
  approved: number;
  total_amount_requested: number;
  total_amount_approved: number;
}

export interface CreatePaymentRequestData {
  payment_reason: string;
  payment_date: string;
  amount: number;
  document: File;
}

export interface PaymentRequestListResponse {
  status: boolean;
  message: string;
  data: {
    results: PaymentRequest[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      pages: number;
    };
  };
}

export interface PaymentRequestDetailResponse {
  status: boolean;
  message: string;
  data: PaymentRequestDetail;
}

export interface PaymentRequestStatisticsResponse {
  status: boolean;
  message: string;
  data: PaymentRequestStatistics;
}
