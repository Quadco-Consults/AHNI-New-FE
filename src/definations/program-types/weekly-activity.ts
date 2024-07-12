export type WeeklyActivityResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  objectives: number;
  ir: string;
  activity_code: string;
  activity_description: string;
  start_date: string;
  end_date: string;
  responsible_person: string;
  resources_required: string;
  memo_required: string;
  ea_required: string;
  results_achieved: string;
  follow_up_action: string;
  comments: string;
  project: string;
};

export interface WeeklyActivityData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: WeeklyActivityResultsData[];
}

export interface WeeklyActivityResponse {
  message: string;
  data: WeeklyActivityResultsData;
}
