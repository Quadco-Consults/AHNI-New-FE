import { z } from "zod";
import { ISubGrantSingleData } from "./contract-management/sub-grant/sub-grant";

// ===== MULTI-AWARD INTERFACES =====

export interface IAwardData {
  id: string;
  partner_name: string;
  coverage_location: string;
  award_amount_usd: number;
  award_amount_ngn: number;
  remaining_amount: number;
  utilization_percentage: number;
  award_start_date: string;
  award_end_date: string;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED" | "DRAFT";
  financial_summary?: IFinancialSummary;
  partner_contact?: IPartnerContact;
}

export interface IFinancialSummary {
  total_obligations: number;
  total_disbursements: number;
  total_expenditures: number;
  pending_obligations: number;
  last_disbursement_date?: string;
  next_disbursement_amount?: number;
}

export interface IPartnerContact {
  email?: string;
  phone?: string;
  address?: string;
  contact_person_name?: string;
  contact_person_title?: string;
}

export interface IMultiAwardSubGrant extends ISubGrantSingleData {
  awards: IAwardData[];
  parent_project: {
    id: string;
    grant_id: string;
    name: string;
    funding_source: string;
  };
  total_award_amount_usd: number;
  total_award_amount_ngn: number;
  total_remaining_amount: number;
  partner_count: number;
  avg_utilization_percentage: number;
  geographic_coverage: string[];
}

export interface ISubGrantOverview {
  subgrant_id: string;
  subgrant_title: string;
  partner_count: number;
  total_award_amount_usd: number;
  total_award_amount_ngn: number;
  total_remaining_amount: number;
  avg_utilization_percentage: number;
  geographic_coverage: string[];
  active_partners: number;
  completed_partners: number;
  awards_summary: {
    total_awards: number;
    active_awards: number;
    completed_awards: number;
    terminated_awards: number;
  };
}

export interface IAwardedPartner {
  id: string;
  partner_name: string;
  partner_email?: string;
  partner_phone?: string;
  partner_address?: string;
  coverage_location: string;
  award_amount_usd: number;
  award_amount_ngn: number;
  utilization_percentage: number;
  award_start_date: string;
  award_end_date: string;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED";
  subgrant: {
    id: string;
    title: string;
    parent_project: {
      id: string;
      name: string;
      funding_source: string;
    };
  };
  financial_summary?: IFinancialSummary;
}

// ===== API RESPONSE INTERFACES =====

export interface IMultiAwardApiResponse {
  status: string;
  message: string;
  data: {
    awards: IAwardData[];
    subgrant_overview: ISubGrantOverview;
  };
}

export interface IAwardedPartnersApiResponse {
  status: string;
  message: string;
  data: {
    results: IAwardedPartner[];
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      previous_page_number?: number | null;
    };
  };
}

export interface IAwardFinancialSummaryResponse {
  status: string;
  message: string;
  data: {
    award_id: string;
    partner_name: string;
    financial_summary: IFinancialSummary;
    recent_transactions: {
      obligations: any[];
      disbursements: any[];
      expenditures: any[];
    };
  };
}

// ===== FORM SCHEMAS =====

export const CreateMultiAwardSchema = z.object({
  subgrant_id: z.string().min(1, "SubGrant ID is required"),
  awards: z.array(z.object({
    partner_name: z.string().min(1, "Partner name is required"),
    coverage_location: z.string().min(1, "Coverage location is required"),
    award_amount_usd: z.number().positive("Award amount must be positive"),
    award_amount_ngn: z.number().positive("Award amount must be positive"),
    award_start_date: z.string().min(1, "Start date is required"),
    award_end_date: z.string().min(1, "End date is required"),
    partner_contact: z.object({
      email: z.string().email("Valid email is required").optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      contact_person_name: z.string().optional(),
      contact_person_title: z.string().optional(),
    }).optional(),
  })).min(1, "At least one award is required"),
});

export type TCreateMultiAwardFormData = z.infer<typeof CreateMultiAwardSchema>;

export const UpdateAwardSchema = z.object({
  partner_name: z.string().min(1, "Partner name is required"),
  coverage_location: z.string().min(1, "Coverage location is required"),
  award_amount_usd: z.number().positive("Award amount must be positive"),
  award_amount_ngn: z.number().positive("Award amount must be positive"),
  award_start_date: z.string().min(1, "Start date is required"),
  award_end_date: z.string().min(1, "End date is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "TERMINATED"]),
  partner_contact: z.object({
    email: z.string().email("Valid email is required").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    contact_person_name: z.string().optional(),
    contact_person_title: z.string().optional(),
  }).optional(),
});

export type TUpdateAwardFormData = z.infer<typeof UpdateAwardSchema>;