export interface SupportiveSupervisionData {
  id: string;
  facility: string;
  month_year: string;
  date_of_visit: string;
  status: string;
  team_members: string[];
}

export interface SupportiveSupervisionResponse {
  message: string;
  data: SupportiveSupervisionData;
}
