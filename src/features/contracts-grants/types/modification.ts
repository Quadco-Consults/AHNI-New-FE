import { z } from "zod";

export const ModificationSchema = z.object({
  // Display only fields (not sent in payload)
  project: z.string().optional(),
  subgrant: z.string().optional(),

  // API required fields
  modification_number: z.coerce.string().min(1, "Please enter modification number"),
  modification_type: z.string().min(1, "Please select modification type"),
  reason: z.string().min(1, "Please enter reason"),
  amount_usd: z.coerce.string().min(1, "Please enter amount in USD"),
  amount_ngn: z.coerce.string().min(1, "Please enter amount in NGN"),
  effective_date: z.string().min(1, "Please select effective date"),
  approval_date: z.string().min(1, "Please select approval date"),
  notes: z.string().min(1, "Please enter notes"),
  approved_by: z.string().min(1, "Please select approver"),
});

export type TModificationFormData = z.infer<typeof ModificationSchema>;

export interface IModificationPaginatedData {
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

export interface IModificationSingleData {
  project?: string;
  title?: string;
  amount: string;
  description?: string;
  date?: string;
}
