/**
 * Obligation Types
 * Types for budget commitments and approved purchase orders
 */

export interface Obligation {
  id: string;
  obligation_number: string;

  // Basic Information
  title: string;
  description: string;
  obligation_type: ObligationType;

  // Financial Details
  amount: number;
  currency: string;
  committed_amount: number;
  liquidated_amount: number;
  remaining_balance: number;

  // Budget Allocation
  budget_line_item?: {
    id: string;
    name: string;
    code: string;
  };
  project?: {
    id: string;
    title: string;
    project_id: string;
  };
  department?: string;

  // Vendor/Supplier Information
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;

  // Dates
  obligation_date: string;
  expected_completion_date?: string;
  actual_completion_date?: string;

  // Status and Workflow
  status: ObligationStatus;
  approval_status: ApprovalStatus;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: {
    id: string;
    name: string;
    email: string;
  };
  rejection_reason?: string;

  // Purchase Order Reference
  purchase_order?: {
    id: string;
    po_number: string;
    total_amount: number;
  };

  // Payment Tracking
  payment_disbursements?: Array<{
    id: string;
    disbursement_number: string;
    amount: number;
    disbursement_date: string;
  }>;

  // Documents
  reference_number?: string;
  contract_number?: string;
  notes?: string;
  attachments?: ObligationAttachment[];

  // Audit Trail
  created_by?: {
    id: string;
    name: string;
    email: string;
  };
  created_datetime: string;
  updated_datetime: string;
  cancelled_at?: string;
  cancelled_by?: {
    id: string;
    name: string;
  };
  cancellation_reason?: string;
}

export interface ObligationAttachment {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  uploaded_by?: {
    id: string;
    name: string;
  };
}

export type ObligationType =
  | 'purchase_order'
  | 'contract'
  | 'service_agreement'
  | 'grant_commitment'
  | 'other';

export type ObligationStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'partially_liquidated'
  | 'fully_liquidated'
  | 'cancelled'
  | 'rejected';

export type ApprovalStatus =
  | 'not_submitted'
  | 'pending'
  | 'approved'
  | 'rejected';

export interface CreateObligationRequest {
  title: string;
  description: string;
  obligation_type: ObligationType;
  amount: number;
  currency?: string;
  budget_line_item?: string; // budget line item ID
  project?: string; // project ID
  department?: string;
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;
  obligation_date: string;
  expected_completion_date?: string;
  purchase_order?: string; // PO ID
  reference_number?: string;
  contract_number?: string;
  notes?: string;
  attachments?: File[];
}

export interface UpdateObligationRequest {
  title?: string;
  description?: string;
  obligation_type?: ObligationType;
  amount?: number;
  budget_line_item?: string;
  project?: string;
  department?: string;
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;
  expected_completion_date?: string;
  reference_number?: string;
  contract_number?: string;
  notes?: string;
}

export interface ApproveObligationRequest {
  action: 'approve' | 'reject';
  comments?: string;
}

export interface LiquidateObligationRequest {
  amount: number;
  disbursement_id?: string;
  liquidation_date: string;
  notes?: string;
}

export interface CancelObligationRequest {
  cancellation_reason: string;
}

export interface ObligationFilters {
  status?: ObligationStatus;
  obligation_type?: ObligationType;
  approval_status?: ApprovalStatus;
  project?: string;
  budget_line_item?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface ObligationSummary {
  total_obligations: number;
  total_amount: number;
  total_committed: number;
  total_liquidated: number;
  total_remaining: number;
  by_status: {
    draft: number;
    pending_approval: number;
    approved: number;
    active: number;
    partially_liquidated: number;
    fully_liquidated: number;
    cancelled: number;
    rejected: number;
  };
  by_type: {
    purchase_order: number;
    contract: number;
    service_agreement: number;
    grant_commitment: number;
    other: number;
  };
  pending_approval_amount: number;
  active_obligations_amount: number;
}

export interface ObligationMetadata {
  obligation_types: Array<{ value: ObligationType; label: string }>;
  projects: Array<{ id: string; title: string; project_id: string }>;
  budget_line_items: Array<{ id: string; name: string; code: string; available_budget: number }>;
  departments: string[];
}

export interface ObligationApiResponse<T = any> {
  status: string;
  message?: string;
  data: T;
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  filters?: ObligationFilters;
  include_attachments?: boolean;
}
