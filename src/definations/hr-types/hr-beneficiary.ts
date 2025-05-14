export type TOnboarding = {
  staff_name: string;
  position: string;
  employment_type: string;
  email: string;
  status: string;
};

export type HrBeneficiaryResults = {
  id: string;
  created_at: string;
  updated_at: string;
  beneficiary_type: string;
  name: string;
  relationship: string;
  percentage_of_benefit: number;
  phone_number: string;
  employee: string;
  is_primary?: boolean;
};
