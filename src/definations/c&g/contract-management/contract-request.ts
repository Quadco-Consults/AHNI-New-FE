// import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const ContractRequestSchema = z.object({
  title: z.string().min(1, "Please enter Request title"),
  request_type: z.string().min(1, "Please select request type"),
  department: z.string().min(1, "Please select request department"),
  consultants_count: z.string().min(1, "Please enter no of consultants"),
  location: z.string().min(1, "Please select request location"),
  fco: z.string().min(1, "Please select FCO"),
  technical_monitor: z.string().min(1, "Please select technical monitor"),
  email: z.string().email("Please enter a valid email"),
  phone_number: z.string().min(1, "Please enter phone number"),
  current_reviewer: z.string().min(1, "Please select current reviewer"),
  // authorizer: z.string().min(1, "Please select authorizer"),
  // approver: z.string().min(1, "Please select approver"),
  // reference_number: z.string().min(1, "Please enter reference number"),
});

export type TContractRequestFormData = z.infer<typeof ContractRequestSchema>;

export interface IContractRequestPaginatedData {
  id: string;
  contract_request_id: string;
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

export interface IContractRequestSingleData {
  // id: string;
  // name: string;
  // contract_request_id: string;
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
});

export type TExpenditureFormData = z.infer<typeof ExpenditureSchema>;

export interface IExpenditurePaginatedData {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  description: string;
  amount: string;
  created_by: null;
  updated_by: null;
  contract_request: string;
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
  contract_request: string;
}

export interface IObligationSingleData {}
