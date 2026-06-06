/**
 * Honour Certificate Types
 * Types for facilitator and consultant payment certificates
 */

export interface HonourCertificate {
  id: string;
  certificate_number: string;
  recipient_name: string;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_address?: string;

  // Service Details
  service_type: ServiceType;
  service_description: string;
  service_date_from: string;
  service_date_to: string;

  // Financial Details
  amount_figures: number;
  amount_words?: string;
  currency: string;

  // Tax Information
  is_taxable: boolean;
  tax_rate: number;
  tax_amount: number;
  net_amount: number;

  // Project Allocation
  project?: {
    id: string;
    title: string;
    project_id: string;
  };
  department?: string;
  location?: string;

  // Status and Workflow
  status: CertificateStatus;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: {
    id: string;
    name: string;
    email: string;
  };
  paid_at?: string;
  paid_by?: {
    id: string;
    name: string;
  };
  rejection_reason?: string;

  // Payment Reference
  payment_disbursement?: {
    id: string;
    disbursement_number: string;
    total_amount: number;
  };

  // Signatures
  authorizer_signature?: string;
  payee_signature?: string;

  // Notes
  notes?: string;
  approval_comments?: string;
  payment_notes?: string;

  // Audit
  created_by?: {
    id: string;
    name: string;
    email: string;
  };
  created_datetime: string;
  updated_datetime: string;

  // Attachments
  attachments?: HonourCertificateAttachment[];
}

export interface HonourCertificateAttachment {
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

export type ServiceType =
  | 'facilitation'
  | 'training'
  | 'consultation'
  | 'volunteer_allowance';

export type CertificateStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'paid'
  | 'rejected'
  | 'cancelled';

export interface CreateHonourCertificateRequest {
  recipient_name: string;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_address?: string;
  service_type: ServiceType;
  service_description: string;
  service_date_from: string;
  service_date_to: string;
  amount_figures: number;
  amount_words?: string;
  currency?: string;
  is_taxable: boolean;
  tax_rate?: number;
  project?: string; // project ID
  department?: string;
  location?: string;
  notes?: string;
  attachments?: File[];
}

export interface UpdateHonourCertificateRequest {
  recipient_name?: string;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_address?: string;
  service_type?: ServiceType;
  service_description?: string;
  service_date_from?: string;
  service_date_to?: string;
  amount_figures?: number;
  amount_words?: string;
  is_taxable?: boolean;
  tax_rate?: number;
  project?: string;
  department?: string;
  location?: string;
  notes?: string;
}

export interface ApprovalAction {
  action: 'approve' | 'reject';
  approval_comments?: string;
}

export interface MarkPaidRequest {
  payment_notes?: string;
  receipt_number?: string;
}

export interface HonourCertificateFilters {
  status?: CertificateStatus;
  service_type?: ServiceType;
  project?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  is_taxable?: boolean;
  page?: number;
  size?: number;
}

export interface HonourCertificateSummary {
  total_certificates: number;
  total_amount: number;
  by_status: {
    draft: number;
    pending_approval: number;
    approved: number;
    paid: number;
    rejected: number;
    cancelled: number;
  };
  by_service_type: {
    facilitation: number;
    training: number;
    consultation: number;
    volunteer_allowance: number;
  };
  total_tax_withheld: number;
  total_net_paid: number;
  pending_approval_amount: number;
  approved_amount: number;
}

export interface HonourCertificateMetadata {
  service_types: Array<{ value: ServiceType; label: string }>;
  projects: Array<{ id: string; title: string; project_id: string }>;
  departments: string[];
  locations: string[];
  default_tax_rate: number;
}

export interface HonourCertificateApiResponse<T = any> {
  status: string;
  message?: string;
  data: T;
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  filters?: HonourCertificateFilters;
  include_attachments?: boolean;
}
