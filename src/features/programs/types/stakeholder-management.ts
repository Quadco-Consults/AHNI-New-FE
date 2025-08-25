import { StakeholderResultsData } from "./stakeholder";

export interface StakeholderMgtProjectsData {
  id: string;
  project_id: string;
  title: string;
  start_date: string;
  end_date: string;
  locations: string[];
}

export interface StakeholderManagementProps {
  id: string;
  created_at: string;
  updated_at: string;
  project_role: string;
  importance: string;
  major_concerns: string;
  influence: string;
  score: string;
  relationship_owner: string;
  stake_holder: StakeholderResultsData;
  project: StakeholderMgtProjectsData;
}

export interface StakeholderManagementData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: StakeholderManagementProps[];
}

export interface StakeholderManagementResponse {
  message: string;
  data: StakeholderManagementProps;
}
