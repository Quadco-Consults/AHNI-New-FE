export type SampleMemoResultsData = {
  requested_date: string;
  reveiwed_by: string;
  requested_by: string;
  created_by: {
    name: string;
  };
  reviewed_by: {
    name: string;
  };
  approved_by: {
    name: string;
  };
  activity: string;
  activity_budget: string;
  approved_by_details: SampleUser;
  approved_date: null;
  balance: "44334.00";
  // budget_expended: "234.00",
  budget_line: string[] | any;
  comment: string;
  // cost_categories: (2) ['222b0091-6ed7-4d8a-bd93-3624c2aeaf10', 'fc699a95-a33d-4da6-adbf-a13a3f16474c'],
  // cost_input: (3) ['6cf79a8c-aace-4584-89c0-abd355944bcb', '15ba119b-8c1c-4c58-a0ed-d2b4f86c2557', '6d18bef6-ed8b-40a3-9465-c3ad9c4e1f29'],
  created_by_details: SampleUser;
  created_date: string | null;
  // created_datetime: "2025-01-27T17:16:05.176539Z",
  expenses: any[];
  fconumber: [];
  // funding_source: (2) ['4efdd621-996f-407c-abc4-7466ae5ab2d9', '0505a14a-3750-4637-aa35-683ee463b918'],
  // id: "14700b16-9a76-46a3-ad06-4371b3dc96a6",
  intervention_areas: string[];
  // is_program: false,
  location: string;
  // project_area: null,

  reviewed_by_details: SampleUser[];
  reviewed_date: null;
  // updated_datetime: "2025-01-27T17:16:05.176554Z"
};

export interface SampleMemoResponse {
  message: string;
  data: SampleMemoResultsData;
}

export type SampleUser = { user_id: number; name: string };
