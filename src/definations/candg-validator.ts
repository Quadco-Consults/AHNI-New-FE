import { z } from "zod";

export const CangGAddGrantsSchema = z.object({
  award_type: z.string(),
  obligations: z.string(),
  award_amount: z.string(),
  monthly_spend: z.string(),
  // status: z.string(),
  reference_number: z.string().optional(),
  project: z.string(),
  department: z.string().uuid(),
  intervention_area: z.string().uuid(),
  grantor: z.string().uuid(),
  location: z.string().uuid(),
});
