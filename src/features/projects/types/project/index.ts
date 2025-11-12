import { z } from "zod";
import { TBeneficiaryData } from "definations/modules/project/beneficiaries";
import { TFundingSourceData } from "definations/modules/project/funding-source";
import { TPartnerData } from "definations/modules/project/partners";
import { IUser } from "features/auth/types/user";
// import { IGrantSingleData } from "features/contracts-grants/types/grants";

// Target Definition Schema
export const ProjectTargetDefinitionSchema = z.object({
  id: z.string().optional(),
  indicator_code: z.string().min(1, "Please select indicator"),
  indicator_name: z.string().min(1, "Please enter indicator name"),
  tracking_mode: z.enum(['SIMPLE', 'QUARTERLY']),
  fiscal_year: z.string().min(1, "Please select fiscal year"),
  annual_target: z.number().min(0, "Annual target must be non-negative"),
  q1_target: z.number().optional(),
  q2_target: z.number().optional(),
  q3_target: z.number().optional(),
  q4_target: z.number().optional(),
  target_notes: z.string().optional(),
});

// Export the target definition type for use in components
export type ProjectTargetDefinition = z.infer<typeof ProjectTargetDefinitionSchema>;

export const ProjectSchema = z.object({
  title: z.string().min(1, "Please enter title"),
  project_id: z.string().min(1, "Please enter project id"),
  location: z.array(z.string().min(1, "Please select project location")),
  intervention_area: z.string().min(1, "Please select intervention area"),
  goal: z.string().min(1, "Please enter goal"),
  narrative: z.string().min(1, "Please enter narrative"),
  budget: z.string().min(1, "Please enter budget"),
  project_managers: z
    .array(z.string())
    .nonempty("Please select project managers"),
  funding_sources: z
    .array(z.string())
    .nonempty("Please select funding sources"),
  currency: z.string().min(1, "Please select currency"),
  beneficiaries: z.array(z.any()).nonempty("Please select target population"),
  expected_results: z.string().min(1, "Please enter expected results"),
  start_date: z.string().min(1, "Please select start date"),
  end_date: z.string().min(1, "Please select end date"),
  // Optional fields that shouldn't block form submission
  budget_performance: z.string().optional(),
  targets: z.array(ProjectTargetDefinitionSchema).optional(),
});

export type TProjectFormValues = z.infer<typeof ProjectSchema>;

export interface IProjectSingleData {
  id: string;
  location: { name: string; id: number }[];
  intervention_area: { code: string; id: string };
  project_managers: IUser[];
  beneficiaries: TBeneficiaryData[];
  funding_sources: TFundingSourceData[];
  objectives: {
    objective: string;
    sub_objectives: string[];
  }[];
  partners: TPartnerData[];
  documents: [];
  // grant: IGrantSingleData;
  created_datetime: string;
  updated_datetime: string;
  project_id: string;
  title: string;
  goal: string;
  narrative: string;
  expected_results: string;
  achievement_against_target: string;
  budget_performance: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  status: string;
  total_obligation_amount: string;
  targets?: ProjectTargetDefinition[]; // Targets defined during project creation
}

export interface ProjectsData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: IProjectSingleData[];
}
