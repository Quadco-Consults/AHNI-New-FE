type beneficiary = {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  name: string;
  relationship: string;
  phone_number: string;
  percentage_of_benefit: number;
  is_primary: boolean;
  employee: string;
};

type emergency_contact = {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  name: string;
  relationship: string;
  email_address: string;
  address: string;
  home_phone: string;
  mobile_phone: string;
  employee: string;
};

export type HrSystemAuthorization = {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  user_login_name: string;
  computer_name: string;
  email_alias: string;
  is_training_completed: boolean;
  authorization_officer_name: string;
  authorization_date: string;
  employee: string;
};

type bank_accounts = {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  bank_name: string;
  branch_name: string;
  account_name: string;
  account_number: string;
  sort_code: string;
  employee: string;
};

type pfas = {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  pfa_name: string;
  pfc_account_name: string;
  rsa_number: string;
  pfc_account_number: string;
  existing_retirement_savings: true;
  account_details_for_existing_pfa: true;
  date: string;
  employee: string;
};

export type HrQualifications = {
  id: string;
  certificate_url: string;
  created_datetime: string;
  updated_datetime: string;
  certificate_name: string;
  institution_name: string;
  date_of_qualification: string;
  employee: string;
};

export interface EmployeeOnboarding {
  id: string;
  passport_url: string;
  signature_url: string;

  beneficiaries: beneficiary[];
  emergency_contacts: emergency_contact[];
  system_authorization: HrSystemAuthorization;
  bank_accounts: bank_accounts;
  pfas: pfas;
  qualifications: HrQualifications;

  created_datetime: string;
  updated_datetime: string;
  legal_firstname: string;
  legal_middlename: string;
  legal_lastname: string;
  phone_number: string;
  other_number: string;
  email: string;
  date_of_birth: string;
  date_of_hire: string;
  ssnumber: string;
  serial_id_code: string;
  marital_status: string;
  own_computer: true;
  require_email_access: true;
  employment_type: string;
  department: string;
  project: string;
  group_membership: number[];
}
export interface EmployeeOnboardingQualifications {
  certificate_name: "string";
  institution_name: "string";
  date_of_qualification: "string";
  certificate_file: "string";
  employee: "string";
}
export interface HrEmergencyResults {
  name: "string";
  relationship: "string";
  email_address: "string";
  address: "string";
  home_phone: "string";
  mobile_phone: "string";
  employee: "string";
}

export type EmployeeOnboardingAddSignatory = {
  id: string;
  created_at: string;
  updated_at: string;
  witness_name: string;
  witness_date: string;
  withness_signature: string;
  employee: string;
};
