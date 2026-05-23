export interface ConsultantLoginCredentials {
  email: string;
  password: string;
}

export interface ConsultantAuthResponse {
  status: boolean;
  message: string;
  data: {
    consultant: {
      id: string;
      profile_id: string;
      full_name: string;
      email: string;
      surname: string;
      other_names: string;
      phone_number: string;
      contract_start_date: string | null;
      contract_end_date: string | null;
      monthly_pay: number | null;
      health_facility_assignment: string | null;
      lga: string | null;
      cluster: string | null;
      spoke_site_name: string | null;
      has_banking_info: boolean;
      bank_name: string | null;
      contract_status: 'INCOMPLETE' | 'NOT_STARTED' | 'ACTIVE' | 'EXPIRING_SOON' | 'COMPLETED';
    };
    access_token: string;
    refresh_token: string;
  };
}

export interface ConsultantPortalUser {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  surname: string;
  other_names: string;
  state_of_origin: string | null;
  qualifications: string | null;
  health_facility_assignment: string | null;
  spoke_site_name: string | null;
  lga: string | null;
  lga2: string | null;
  cluster: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  monthly_pay: number | null;
  contract_status: 'INCOMPLETE' | 'NOT_STARTED' | 'ACTIVE' | 'EXPIRING_SOON' | 'COMPLETED';
  qmap_backstop: string | null;
  programs_officer: string | null;
  stl: string | null;
  seo: string | null;
  status_of_adhoc_staff: string | null;
  account_name: string | null;
  bank_name: string | null;
  account_number: string | null;
  sort_code: string | null;
  stats: {
    total_payment_requests: number;
    pending_payment_requests: number;
    approved_payment_requests: number;
    total_payments_received: number;
  };
  profile_completion: {
    percentage: number;
    completed_fields: number;
    total_fields: number;
    missing_fields: string[];
  };
  user_info: {
    email: string;
    last_login: string | null;
    date_joined: string | null;
  };
}

export interface ConsultantPortalStats {
  pending_payment_requests: number;
  approved_payment_requests: number;
  contract_days_remaining: number | null;
  last_payment_date: string | null;
}
