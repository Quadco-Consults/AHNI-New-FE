import { z } from "zod";

const monthly_budget = z.object({
  month: z.string(),
  frequency: z.number(),
  monthly_total: z.number(),
});

export const ProgramWorkPlanSchema = z.object({
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

export const ProgramActivitySchema = z.object({
  created_at: z.string(),
  updated_at: z.string(),
  objectives: z.number(),
  ir: z.string(),
  activity_code: z.string(),
  activity_description: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  responsible_person: z.string(),
  resources_required: z.string(),
  memo_required: z.string(),
  ea_required: z.string(),
  results_achieved: z.string(),
  follow_up_action: z.string(),
  comments: z.string(),
  project: z.string(),
});

export const SupportiveSupervisionSchema = z.object({
  facility: z.string(),
  month_year: z.string(),
  date_of_visit: z.string(),
  status: z.string(),
  evaluation_criteria: z.array(z.string()),
  team_members: z.array(z.string()),
});
