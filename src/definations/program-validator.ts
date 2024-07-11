import { z } from "zod";

const monthly_budget = z.object({
  month: z.string(),
  frequency: z.number(),
  monthly_total: z.number(),
});

export const ProgramWorkPlanSchema = z.object({
  //   id: z.string(),
  monthly_budget: z.array(monthly_budget),
  annual_total_in_ngn: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  identification: z.string(),
  description: z.string(),
  activity_justification: z.string(),
  lead_department: z.string(),
  lead_person: z.string(),
  unit_cost_ngn: z.number(),
  expected_result: z.string(),
  indicator: z.string(),
  mov: z.string(),
  locations: z.string(),
  approval_number: z.string(),
  comments: z.string(),
  financial_year: z.string(),
  project_objective: z.string(),
  partner: z.string(),
  project: z.string(),
});
