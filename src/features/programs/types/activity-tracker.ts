import { z } from "zod";

export const WorkPlanTrackerSchema = z.object({
    output_description: z.string().nullable().optional(),
    achieved_output: z.string().nullable().optional(),
    achievement_percentage: z.string().nullable().optional(),
    amount_expended_ngn: z.string().nullable().optional(),
    amount_expended_usd: z.string().nullable().optional(),
    implementation_usd_rate: z.string().nullable().optional(),
    expenditure_usd_rate: z.string().nullable().optional(),
    expenditure_ngn_rate: z.string().nullable().optional(),
    variance_ngn: z.string().nullable().optional(),
    variance_usd: z.string().nullable().optional(),
    percentage_variance_ngn: z.string().nullable().optional(),
    percentage_variance_usd: z.string().nullable().optional(),
    efficiency_output_expenditure_ratio: z.string().nullable().optional(),
    efficiency_output_expenditure_level: z.string().nullable().optional(),
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
