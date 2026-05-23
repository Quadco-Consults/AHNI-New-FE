import { z } from "zod";

export const ModificationSchema = z.object({
  // Display only fields (not sent in payload)
  project: z.string().optional(),
  subgrant: z.string().optional(),

  // API required fields
  modification_number: z.coerce.string().min(1, "Please enter modification number"),
  modification_type: z.string().min(1, "Please select modification type"),
  reason: z.string().min(1, "Please enter reason"),

  // Conditionally required fields
  amount_usd: z.coerce.string().optional(),
  amount_ngn: z.coerce.string().optional(),
  start_date: z.string().optional(), // For performance period changes
  end_date: z.string().optional(),   // For performance period changes
  approval_date: z.string().optional(), // Auto-generated, not user input
  notes: z.string().min(1, "Please enter notes"),
  approved_by: z.string().min(1, "Please select approver"),
}).superRefine((data, ctx) => {
  // Validate based on modification type
  const isObligationChange = data.modification_type === 'INCREASE_OBLIGATION' || data.modification_type === 'DE_OBLIGATION';
  const isPerformancePeriodChange = data.modification_type === 'INCREASE_PERFORMANCE_PERIOD' || data.modification_type === 'REDUCE_PERFORMANCE_PERIOD';

  // For obligation changes, amount fields are required
  if (isObligationChange) {
    if (!data.amount_usd || data.amount_usd.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount in USD is required for obligation changes",
        path: ["amount_usd"],
      });
    }
    if (!data.amount_ngn || data.amount_ngn.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount in NGN is required for obligation changes",
        path: ["amount_ngn"],
      });
    }
  }

  // For performance period changes, date fields are required
  if (isPerformancePeriodChange) {
    if (!data.start_date || data.start_date.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date is required for performance period changes",
        path: ["start_date"],
      });
    }
    if (!data.end_date || data.end_date.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required for performance period changes",
        path: ["end_date"],
      });
    }
  }
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
