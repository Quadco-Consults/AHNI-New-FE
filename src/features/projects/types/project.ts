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
  intervention_area: z.string().optional(),
});

export type TProjectFormValues = z.infer<typeof ProjectSchema>;

export interface IProjectSingleData {
  id: string;
  title: string; // API uses 'title' not 'name'
  name: string; // Keep for backward compatibility
  currency: string;
  funding_sources: { id: string; name: string }[];
  project_managers: { id: string; first_name: string; last_name: string }[];
  beneficiaries: { id: string; name: string }[];
  location: { id: number; name: string }[];
  intervention_area: { id: string; code: string };
  project_id: string;
  goal: string;
  narrative: string;
  budget_performance: string;
  achievement_against_target: string;
  expected_results: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: string;
  status: string;
  created_datetime: string;
  updated_datetime: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface TProjectDocumentData {
  id: string;
  title: string;
  project: string;
  file: string;
  created_datetime: string;
  updated_datetime: string;
}
