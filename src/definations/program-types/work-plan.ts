import { TFinancialYearData } from "definations/modules/config/financial-year";
// import { TPartnerData } from "definations/modules/project/partners";
import { IProjectSingleData } from "definations/project";

export interface TWorkPlanPaginatedResponse {
  id: string;
  project: string;
  project_partners: string[];
  financial_year: string;
  currency: string;
  budget: number;
  created_datetime: string;
  updated_datetime: string;
  created_by: string;
  updated_by: null;
}

export interface TWorkPlanSingleResponse {
  id: string;
  project: IProjectSingleData;
  activities: TActivity[];
  budget_unit_cost_ngn: string;
  financial_year: TFinancialYearData;
}

export type TMonth =
    | "Jan"
    | "Feb"
    | "Mar"
    | "Apr"
    | "May"
    | "Jun"
    | "Jul"
    | "Aug"
    | "Sep"
    | "Oct"
    | "Nov"
    | "Dec";

export type TMonthChart = Record<TMonth, number>;

export interface TActivity {
  id: string;
  activity_number: string;
  activity: string;
  activity_justification: string;
  lead_dept: string;
  lead_person: string;
  intervention_area: string;
  cost_grouping: string;
  cost_catergory: string;
  cost_input: string;
  budget_line: string;
  objectives_sub_objectives: string;
  description_of_output: string;
  gant_chart: {
    Apr: number;
    Aug: number;
    Dec: number;
    Feb: number;
    Jan: number;
    Jul: number;
    Jun: number;
    Mar: number;
    May: number;
    Nov: number;
    Oct: number;
    Sep: number;
  };
  budget_chart: {
    Apr: number;
    Aug: number;
    Dec: number;
    Feb: number;
    Jan: number;
    Jul: number;
    Jun: number;
    Mar: number;
    May: number;
    Nov: number;
    Oct: number;
    Sep: number;
  };
  total_amount_ngn: string;
  total_amount_usd: string;
  expected_result: string;
  indicator: string;
  mov: string;
  unit_cost_ngn: null;
  location: string;
  approved_ref_no: null;
  comments: string;
  work_plan: string;
}
