export type ItemsResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  uom: string;
  category: string;
};

export interface ItemsData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: ItemsResultsData[];
}

export interface ItemsResponse {
  message: string;
  data: ItemsResultsData;
}