import { SolicitationItems } from "./solicitation";

export type CommitteeMemberData = {
  id: string;
  first_name: string;
  last_name: string;
  designation: string;
};
export type SubmissionData = {
  unit_price: number;
  sub_total: number;
  quantity: number;
  vendor: string;
  id: string;
};

export type VendorSubmissionData = {
  item: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    uom: string;
    category: string;
    quantity: number;
  };
  submissions: SubmissionData[];
};

export type CbaResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  vendor_submissions: VendorSubmissionData[];
  vendor_responses: {};
  cba_type: string;
  cba_date: string;
  remarks: string;
  status: string;
  solicitation: string;
  solicitation_name: string;
  title: string;
  items: SolicitationItems[];
  lot: number;
  assignee: CommitteeMemberData;
  committee_members: CommitteeMemberData[];
};

export interface CbaData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: CbaResultsData[];
}

export interface CbaResponse {
  message: string;
  data: CbaResultsData;
}

export interface CbaSubmitPayload {
  submission_ids: string[];
  remarks: string;
}
