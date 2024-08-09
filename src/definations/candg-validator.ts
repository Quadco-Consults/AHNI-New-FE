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

export const CangGAddExpenditureSchema = z.object({
  amount: z.string(),
  // month_year: z.string(),
});

export const TaskSchema = z.object({
  designation: z.string(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  status: z.enum(["Pending", "Approved", "Rejected"]),
  remarks: z.string(),
});

export const ClosuOutPlanSchema = z.object({
  tasks: z.array(TaskSchema),
  key_task: z.string(),
  project: z.string().uuid(),
  department: z.string().uuid(),
  location: z.string().uuid(),
});
