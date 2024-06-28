export type PartnerResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  address: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
};

export interface PartnersData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: PartnerResultsData[];
}

export interface PartnersResponse {
  message: string;
  data: PartnersData;
}
