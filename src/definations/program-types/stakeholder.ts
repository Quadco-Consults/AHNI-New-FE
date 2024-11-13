export interface StakeholderResultsData {
  id: string;
  created_at: string;
  updated_at: string;
  stakeholder_name: string;
  institution_organization: string;
  physical_office_address: string;
  state: string;
  gender: string;
  designation: string;
  phone_number: string;
  email: string;
  project_role: string;
  importance: string;
  influence: string;
  score: number;
  major_concerns: string;
  relationship_owner: string;
}

export interface StakeholderData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: StakeholderResultsData[];
}

export interface StakeholderResponse {
  message: string;
  data: StakeholderResultsData;
}
