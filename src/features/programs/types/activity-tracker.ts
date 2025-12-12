import { z } from "zod";

export const WorkPlanTrackerSchema = z.object({
    description_of_output: z.string().nullable().optional(), // Correct backend field
    achieved_results: z.string().nullable().optional(), // Correct backend field for ActivityPlanFromWorkPlan
    amount_expended_ngn: z.union([z.string(), z.number()]).transform(val => String(val)).nullable().optional(),
    expenditure_usd_rate: z.union([z.string(), z.number()]).transform(val => String(val)).nullable().optional(),
    expenditure_ngn_rate: z.union([z.string(), z.number()]).transform(val => String(val)).nullable().optional(),
    comments: z.string().nullable().optional(),
});

export type TWorkPlanTrackerFormValues = z.infer<typeof WorkPlanTrackerSchema>;

export interface TWorkPlanTrackerData {
    id: string;
    project: string;
    created_datetime: string;
    updated_datetime: string;
    activity_name: string;
    activity_reference_number: string;
    month: string;
    activity_plans: string;
    objectives: [
        {
            objective: string;
            sub_objectives: string[];
        }
    ];
    location: string;
    ir: string;
    lead_dept: string;
    lead_partner: string;
    activity_frequency: string;
    planned_output: string;
    output_description: string;
    achieved_output: string;
    achievement_percentage: string;
    status: string;
    total_amount_ngn: string;
    total_amount_usd: string;
    amount_expended_ngn: string;
    implementation_usd_rate: string;
    amount_expended_usd: string;
    expenditure_usd_rate: string;
    expenditure_ngn_rate: string;
    variance_ngn: string;
    variance_usd: string;
    percentage_variance_ngn: string;
    percentage_variance_usd: string;
    efficiency_output_expenditure_ratio: string;
    efficiency_output_expenditure_level: string;
    comments: string;
    created_by: string;
    updated_by: string;
    work_plan_activity: string;
}
