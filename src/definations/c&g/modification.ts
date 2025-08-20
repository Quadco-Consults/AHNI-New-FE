import { z } from "zod";

export const ModificationSchema = z.object({
  title: z.string().min(1, "Please select project").optional(),
  project: z.string().min(1, "Please select project").optional(),
  amount: z.string().min(1, "Please select project").optional(),
  description: z.string().min(1, "Please select award type"),
  date: z.string().min(1, "Please enter award amount").optional(),
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
