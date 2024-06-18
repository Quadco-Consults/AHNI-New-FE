export type ProjectsResultsData = {
  id: string;
  beneficiaries: [
    {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
    }
  ];
  funding_sources: [
    {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
    }
  ];
  objectives: [
    {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
      project: string;
      parent: string;
    }
  ];
  project_partners: [
    {
      id: string;
      created_at: string;
      updated_at: string;
      location: string;
      project: string;
      partner: string;
    }
  ];
  documents: [
    {
      id: string;
      created_at: string;
      updated_at: string;
      title: string;
      document: string;
      project: string;
    }
  ];
  created_at: string;
  updated_at: string;
  project_id: string;
  title: string;
  goal: string;
  expected_results: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  project_manager: string;
  funding_source: string[];
};

export interface ProjectsData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: ProjectsResultsData[];
}

export interface ProjectsResponse {
  message: string;
  data: ProjectsData;
}
