import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(1, "Please enter project title"),
  project_id: z.string().min(1, "Please enter project ID"),
  location: z.array(z.string()).min(1, "Please select at least one location"),
  goal: z.string().min(1, "Please enter project goal"),
  narrative: z.string().min(1, "Please enter project narrative"),
  budget: z.string().min(1, "Please enter budget"),
  funding_sources: z
    .array(z.string())
    .min(1, "Please select at least one funding source"),
  project_managers: z
    .array(z.string())
    .min(1, "Please select at least one project manager"),
  expected_results: z.string().min(1, "Please enter expected results"),
  budget_performance: z.string().optional(),
  achievement_against_target: z
    .string()
    .min(1, "Please enter achievement against target"),
  beneficiaries: z
    .array(z.string())
    .min(1, "Please select at least one beneficiary"),
  currency: z.string().min(1, "Please select currency"),
  start_date: z.string().min(1, "Please select start date"),
  end_date: z.string().min(1, "Please select end date"),
  intervention_areas: z.array(z.string()).optional(),
});

export type TProjectFormValues = z.infer<typeof ProjectSchema>;

// Export the full interface from project/index.ts
export * from './project/index';

export interface TProjectDocumentData {
  id: string;
  title: string;
  project: string;
  file: string;
  created_datetime: string;
  updated_datetime: string;
}
