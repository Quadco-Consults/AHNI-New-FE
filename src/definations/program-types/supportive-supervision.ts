export interface SupportiveSupervisionEvaluationData {
  id: string;
  name: string;
  description: string;
  category: string;
  requires_document: boolean;
}

export interface FacilityContacts {
  id: string;
  name: string;
  position: string;
  phone_number: string;
  email: string;
  facility: string;
}
export interface TeamMembers {
  id: string;
  first_name: string;
  last_name: string;
  designation: string;
  email: string;
  phone_number: string;
}

export interface Criteria {
  id: string;
  name: string;
  description: string;
  category: string;
  requires_document: boolean;
  response_id: string;
}

export interface EvaluationCriteria {
  name: string;
  description: string;
  criteria: Criteria[];
}

export interface SupportiveSupervisionData {
  id: string;
  facility: {
    id: string;
    name: string;
    state: string;
    local_govt: string;
    facility_contacts: FacilityContacts[];
  };
  month_year: string;
  date_of_visit: string;
  status: string;
  team_members: TeamMembers[];
  evaluation_criteria: EvaluationCriteria[];
}

export interface SupportiveSupervisionResponse {
  message: string;
  data: SupportiveSupervisionData;
}
