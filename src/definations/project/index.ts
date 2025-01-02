import { z } from "zod";
import { TBeneficiaryData } from "definations/modules/project/beneficiaries";
import { TFundingSourceData } from "definations/modules/project/funding-source";
import { TPartnerData } from "definations/modules/project/partners";
import { TUser } from "definations/users";

export const ProjectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    project_id: z.string().min(1, "ProjectID is required"),
    goal: z.string().min(1, "Goal is required"),
    narrative: z.string().min(1, "Narrrative is required"),
    budget_performance: z.string().min(1, "Budget performance is required"),
    budget: z.union([z.string(), z.number()]),
    project_managers: z.array(z.string()),
    funding_sources: z.array(z.string()),
    currency: z.string().min(1, "Field Required"),
    beneficiaries: z.array(z.any()),
    expected_results: z.string().min(1, "This field is required"),
    achievement_against_target: z.string().min(1, "This field is required"),
});

export type TProjectFormValues = z.infer<typeof ProjectSchema>;

export interface TProjectData {
    id: string;
    created_datetime: "string";
    updated_datetime: string;
    project_id: string;
    title: string;
    goal: string;
    currency: string;
    expected_results: string;
    start_date: string;
    end_date: string;
    budget: number;
    status: string;
    narrative: string;
    budget_performance: string;
    project_managers: TUser[];
    beneficiaries: TBeneficiaryData[];
    funding_sources: TFundingSourceData[];
    achievement_against_target: string;
    partners: TPartnerData[];
    objectives: {
        objective: string;
        sub_objectives: string[];
    }[];
}
