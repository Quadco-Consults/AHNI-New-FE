export interface VendorLoginCredentials {
  email: string;
  password: string;
}

export interface VendorCategory {
  id: string;
  name: string;
  description?: string;
}

export interface VendorAuthResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email: string;
      vendor: {
        id: string;
        company_name: string;
        status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
        is_active: boolean;
        approved_categories: VendorCategory[];
      };
    };
  };
}

export interface VendorPortalUser {
  id: string;
  company_name: string;
  email: string;
  phone_number?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
  is_active: boolean;
  approved_categories: VendorCategory[];
  submitted_categories?: VendorCategory[];
  type_of_business?: string;
  registration_date: string;
  last_login?: string;
  active_rfqs?: string[];
  submitted_bids: number;
  awarded_contracts: number;
  prequalification_summary?: {
    total_categories_applied: number;
    categories_approved: number;
    categories_rejected: number;
    approval_rate: number;
  };
}

export interface VendorRFQAccess {
  rfq_id: string;
  rfq_title: string;
  rfq_status: string;
  closing_date: string;
  submission_status: 'NOT_STARTED' | 'DRAFT' | 'SUBMITTED' | 'EVALUATED';
  eligibility_status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PENDING_REVIEW';
  categories: string[];
}

export interface VendorPortalStats {
  total_rfqs_available: number;
  submitted_bids: number;
  pending_evaluations: number;
  awarded_contracts: number;
  success_rate: number;
}