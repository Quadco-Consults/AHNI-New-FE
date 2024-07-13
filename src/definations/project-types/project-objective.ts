export type ProjectObjectiveResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  project: string;
  parent: string;
};

export interface ProjectObjectiveData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: ProjectObjectiveResultsData[];
}

export interface ProjectObjectiveResponse {
  message: string;
  data: ProjectObjectiveResultsData;
}
