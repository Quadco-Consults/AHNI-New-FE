import { CategoryResultsData } from "definations/configs/category";

export type EOIType = 'NEW_VENDOR' | 'OPEN_TENDER' | 'PROCUREMENT_WITH_REGISTRATION';

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
  type?: EOIType;
  solicitation?: string;
  financial_year: {
    year: string;
    is_current: boolean;
  } | string;
  categories: CategoryResultsData[];
  // Enhanced fields for PROCUREMENT_WITH_REGISTRATION
  procurement_details?: {
    solicitation_id?: string;
    auto_qualify_vendors?: boolean;
    technical_requirements?: string;
    financial_requirements?: string;
    min_vendor_experience_years?: number;
    required_certifications?: string[];
  };
  registration_settings?: {
    auto_approve_qualified?: boolean;
    expedited_review?: boolean;
    required_categories?: string[];
  };
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
