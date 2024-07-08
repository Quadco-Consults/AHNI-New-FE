export interface SupportiveSupervisionEvaluationData {
  id: string;
  name: string;
  description: string;
  category: string;
  requires_document: boolean;
}

export interface SupportiveSupervisionData {
  id: string;
  facility: {
    id: string;
    name: string;
    state: string;
    local_govt: string;
    facility_contacts: [
      {
        id: string;
        name: string;
        position: string;
        phone_number: string;
        email: string;
        facility: string;
      }
    ];
  };
  month_year: string;
  date_of_visit: string;
  status: string;
  team_members: {
    id: string;
    first_name: string;
    last_name: string;
    designation: string;
    email: string;
    phone_number: string;
  }[];
  evaluation_criteria: [];
}

export interface SupportiveSupervisionResponse {
  message: string;
  data: SupportiveSupervisionData[];
}
