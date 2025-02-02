import { CategoryResultsData } from "definations/configs/category";

export type EOIResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  status: string;
  opening_date: string;
  closing_date: string;
  document: string;
  eoi_number: string;
  financial_year: {
    year: string;
    is_current: boolean;
  };
  categories: CategoryResultsData[];
};

export interface EOIData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: EOIResultsData[];
}

export interface EOIResponse {
  message: string;
  data: EOIResultsData;
}
