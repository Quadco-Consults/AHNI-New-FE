// import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const ContractRequestSchema = z.object({
  title: z.string().min(1, "Please enter Request title"),
  request_type: z.string().min(1, "Please select request type"),
  department: z.string().min(1, "Please select request department"),
  consultants_count: z.string().min(1, "Please enter no of consultants"),
  location: z.string().min(1, "Please select request location").refine(val => val !== "", "Please select request location"),
  fco: z.string().min(1, "Please select FCO"),
  technical_monitor: z.string().min(1, "Please select technical monitor"),
  email: z.string().email("Please enter a valid email"),
  phone_number: z.string().min(1, "Please enter phone number"),
  current_reviewer: z.string().min(1, "Please select current reviewer").refine(val => val !== "", "Please select current reviewer"),
  authorizer: z.string().optional(),
  approver: z.string().optional(),
  // reference_number: z.string().min(1, "Please enter reference number"),
});

export type TContractRequestFormData = z.infer<typeof ContractRequestSchema>;

export interface IContractRequestPaginatedData {
  id: string;
  contract_request_id?: string;
  name?: string;
  title: string;
  request_type: string;
  request_type_display?: string;
  status: string;
  status_display?: string;
  department?: {
    id: string;
    name: string;
  };
  location_detail?: {
    id: string;
    name: string;
  };
  consultants_count: number;
  email: string;
  phone_number: string;
  fco?: string;
  technical_monitor?: string;
  
  // Workflow assignment fields
  current_reviewer?: string;
  current_reviewer_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  authorizer?: string;
  authorizer_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  approver?: string;
  approver_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  
  // Existing fields
  funding_sources?: { name: string }[];
  beneficiaries?: string[];
  current_month_expenditure_amount?: string | null;
  current_month_obligation_amount?: string | null;
  total_obligation_amount?: string;
  total_expenditure_amount?: string;
  created_datetime: string;
  updated_datetime: string;
  award_type?: string;
  award_amount?: string;
  reference_number?: string;
  created_by?: string | {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  updated_by?: null;
  modifications?: { name: string }[];
}

export interface IContractRequestSingleData {
  id: string;
  title: string;
  request_type: string;
  request_type_display?: string;
  status: string;
  status_display?: string;
  department?: {
    id: string;
    name: string;
  };
  location_detail?: {
    id: string;
    name: string;
  };
  consultants_count: number;
  email: string;
  phone_number: string;
  fco?: string;
  technical_monitor?: string;
  
  // Workflow assignment fields
  current_reviewer?: string;
  current_reviewer_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  authorizer?: string;
  authorizer_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  approver?: string;
  approver_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  
  created_datetime: string;
  updated_datetime: string;
  created_by?: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  updated_by?: null;
  
  // Legacy fields for compatibility
  award_type?: string;
  project_id?: string;
  award_reference_number?: string;
  award_amount?: string;
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
