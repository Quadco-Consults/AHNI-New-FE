export type ProjectPartnerResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  location: string;
  project: string;
  partner: string;
};

export interface ProjectPartnersData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: ProjectPartnerResultsData[];
}

export interface ProjectPartnersResponse {
  message: string;
  data: ProjectPartnerResultsData;
}
