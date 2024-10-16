import { FinancialYearResultsData } from "definations/configs/financial-year";
import { PartnerResultsData } from "definations/project-types/partners";
import { ProjectsResultsData } from "definations/project-types/projects";

export interface WorkPlanResultsData {
  id: string;
  monthly_budget: {
    month: string;
    frequency: number;
    monthly_total: number;
  }[];
  annual_total_in_ngn: string;
  created_at: string;
  updated_at: string;
  identification: string;
  description: string;
  activity_justification: string;
  lead_department: string;
  lead_person: string;
  unit_cost_ngn: number;
  expected_result: string;
  indicator: string;
  mov: string;
  locations: string;
  approval_number: string;
  comments: string;
  financial_year: string;
  project_objective: string;
  partner: string;
  project: string;
}

export interface WorkPlanData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: WorkPlanResultsData[];
}

export interface WorkPlanResponse {
  message: string;
  data: WorkPlanResultsData;
}

export interface WorkPlanList {
  project_id: string;
  project_title: string;
  partner_id: string;
  partner_name: string;
  financial_year: FinancialYearResultsData;
  budget: number;
  count: 1;
}

export interface WorkPlanListData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: WorkPlanList[];
}

export interface WorkPlanDetails {
  project: {
    id: string;
    project_partners: [
      {
        location: string;
        partners: [
          {
            id: string;
            created_at: string;
            updated_at: string;
            name: string;
            address: string;
            city: string;
            state: string;
            email: string;
            phone: string;
            website: string;
            logo: string;
          }
        ];
      }
    ];
    project_objectives: [
      {
        id: string;
        title: string;
        serial_number: number;
        sub_objectives: [
          {
            id: string;
            title: string;
            serial_number: number;
          }
        ];
      },
      {
        id: string;
        title: string;
        serial_number: number;
        sub_objectives: [
          {
            id: string;
            title: string;
            serial_number: number;
          }
        ];
      }
    ];
    project_beneficiaries: [
      {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        description: string;
      },
      {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        description: string;
      }
    ];
    project_funding_source: [
      {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        description: string;
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
    narrative: string;
    budget_performance: string;
    stake_holders: string[];
  };
  partner: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    address: string;
    city: string;
    state: string;
    email: string;
    phone: string;
    website: string;
    logo: string;
  };
  workplans: [
    {
      id: string;
      monthly_budget: [
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        },
        {
          month: string;
          frequency: string;
          monthly_total: number;
        }
      ];
      annual_total_in_ngn: number;
      created_at: string;
      updated_at: string;
      identification: string;
      description: string;
      activity_justification: string;
      lead_department: string;
      lead_person: string;
      unit_cost_ngn: number;
      expected_result: string;
      indicator: string;
      mov: string;
      locations: string[];
      approval_number: string;
      comments: string;
      financial_year: FinancialYearResultsData;
      project_objective: string;
      partner: PartnerResultsData;
      project: ProjectsResultsData;
    }
  ];
}
