import { TAssetSingleData } from "features/admin/types/inventory-management/asset";
import { LocationResultsData } from "definations/configs/location";

export type SolicitationItems = {
  id: string;
  created_at: string;
  updated_at: string;
  quantity: number;
  item: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    uom: string;
    category: string;
  };
  solicitation: string;
  lot: number;
};
export type SolicitationCriteria = {
  name: string;
  solicitation_criteria: string;
};

export type SolicitationResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  name: string;
  description: string;
  opening_date: string;
  closing_date: string;
  document: string;
  tender_type: string;
  request_type: string;
  limited_vendors: string;
  items: SolicitationItems[];
  criteria: SolicitationCriteria[];
  location: LocationResultsData;
  reference: string;
  purchase_request: string;
};

export interface SolicitationData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: SolicitationResultsData[];
}

export interface SolicitationResponse {
  message: string;
  data: SolicitationResultsData;
}

export type SolicitationSubmissionResultsData = {
  id: string;
  company_name: string;
  company_registration_number: string;
  year_or_incorperation: string;
  nature_of_business: string;
  status: string;
  vendor: {
    company_name: string;
    company_registration_number: string;
    type_of_business: string;
    status: string;
    email: string;
  };
  bid_details: {
    status: string;
  };
  solicitation: {
    rfq_id: string;
    rfq_date: string;
    title: string;
  };
};

export interface SolicitationSubmissionData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  data: {
    results: SolicitationSubmissionResultsData[];
  };
}

// -------------------------------
export interface ISolicitationRFQData {
  id: string;
  rfq_id: string | null;
  purchase_request: string;
  title: string;
  background: string;
  status: string;
  opening_date: string;
  closing_date: string;
  tender_type: string;
  request_type: string;
  procurement_type: null;
  solicitation_items?: [
    {
      id: string;
      item: TAssetSingleData;
      lot: string;
      quantity: number;
      frequency?: number;
      number_of_days?: number;
      description?: string;
      specification?: string;
      item_detail: {
        name: string;
        uom: string;
        description: string;
      };
      lot_detail: {
        name: string;
      };
    }
  ];
  items?: any[]; // Alternative field name that might be returned
  solicitation_evaluations: [
    {
      id: string;
      criteria: string;
      title: string;
      description: string;
    }
  ];
}
