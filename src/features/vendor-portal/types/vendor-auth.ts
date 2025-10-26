export interface VendorLoginCredentials {
  email: string;
  password: string;
}

export interface VendorAuthResponse {
  access_token: string;
  refresh_token: string;
  vendor: {
    id: string;
    company_name: string;
    email: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    approved_categories: string[];
    registration_date: string;
  };
}

export interface VendorPortalUser {
  id: string;
  company_name: string;
  email: string;
  phone_number: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  approved_categories: string[];
  submitted_categories: string[];
  type_of_business: string;
  registration_date: string;
  last_login: string;
  active_rfqs: string[];
  submitted_bids: number;
  awarded_contracts: number;
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