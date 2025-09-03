// import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const GrantSchema = z.object({
  name: z.string().min(1, "Please select project").optional(),
  project_id: z.string().min(1, "Please select project").optional(),
  grant_id: z.string().min(1, "Please select project").optional(),
  award_type: z.string().min(1, "Please select award type"),
  award_amount: z.string().min(1, "Please enter award amount").optional(),
  reference_number: z.string().min(1, "Please enter reference number"),
});

export type TGrantFormData = z.infer<typeof GrantSchema>;

export interface IGrantPaginatedData {
  id: string;
  grant_id: string;
  name: string;
  status: string;
  funding_sources: { name: string }[];
  beneficiaries: string[];
  current_month_expenditure_amount: string | null;
  current_month_obligation_amount: string | null;
  total_obligation_amount: string;
  total_expenditure_amount: string;
  created_datetime: string;
  updated_datetime: string;
  award_type: string;
  award_amount: string;
  reference_number: string;
  created_by: string;
  updated_by: null;
  modifications: { name: string }[];
}

export interface IGrantSingleData {
  // id: string;
  // name: string;
  // grant_id: string;
  // created_datetime: string;
  // updated_datetime: string;
  // award_type: string;
  // award_amount: string;
  // reference_number: string;
  // created_by: string;
  // updated_by: null;
  // total_obligation_amount: string | null;
  // total_expenditure_amount: string | null;

  title?: string;
  award_type: string;
  project_id?: string;
  award_reference_number?: string;
  award_amount: string;
  funding_source?: string;
  pipeline?: string;
  money_months_remaining?: string;
  burn_rate?: string;
}

export const ExpenditureSchema = z.object({
  amount: z.string().min(1, "Please enter amount"),
  description: z.string().min(1, "Please enter description"),
  work_plan_activity: z.string().optional(),
  date: z.string().min(1, "Please select date"),
});

export type TExpenditureFormData = z.infer<typeof ExpenditureSchema>;

export interface IExpenditurePaginatedData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  description: string;
  amount: string;
  work_plan_activity?: string;
  work_plan_activity_details?: {
    id: string;
    work_plan_title: string;
    work_plan_activity_identifier: string;
    activity_name: string;
    activity_description: string;
    status: string;
    [key: string]: any;
  } | null;
  project_details?: {
    id: string;
    project_id: string;
    title: string;
    status: string;
    currency: string;
    budget: number;
    award_amount: number;
  } | null;
  date: string;
  created_by: null;
  updated_by: null;
  grant: string;
  project: string;
}

export interface IExpenditureSingleData {}

export const ObligationSchema = z.object({
  amount: z.string().min(1, "Please enter amount"),
  description: z.string().min(1, "Please enter description"),
});

export type TObligationFormData = z.infer<typeof ObligationSchema>;

export interface IObligationPaginatedData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  description: string;
  amount: string;
  created_by: null;
  updated_by: null;
  grant: string;
}

export interface IObligationSingleData {}
