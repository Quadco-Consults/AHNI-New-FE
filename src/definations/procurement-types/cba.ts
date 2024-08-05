import { SolicitationItems } from "./solicitation";

export type CommitteeMemberData = {
  id: string;
  first_name: string;
  last_name: string;
  designation: string;
};
export type CbaResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  vendor_submissions: string;
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
