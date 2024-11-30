import { z } from "zod";

export const ActivityTrackerSchema = z.object({
    activity_name: z.string().min(1, "This field is required"),
    activity_reference_number: z.string().min(1, "This field is required"),
    month: z.string().min(1, "This field is required"),
    activity_plans: z.string().min(1, "This field is required"),
    objectives: z.string().min(1, "This field is required"),
    location: z.string().min(1, "This field is required"),
    ir: z.string().min(1, "This field is required"),
    lead_dept: z.string().min(1, "This field is required"),
    lead_partner: z.string().min(1, "This field is required"),
    activity_frequency: z.string().min(1, "This field is required"),
    planned_output: z.string().min(1, "This field is required"),
    output_description: z.string().min(1, "This field is required"),
    achievement_percentage: z.string().min(1, "This field is required"),
    status: z.enum(["PENDING", "APPROVED"]),
    total_amount_ngn: z.string().min(1, "This field is required"),
    total_amount_usd: z.string().min(1, "This field is required"),
    expended_amount_ngn: z.string().min(1, "This field is required"),
    implementation_usd_rate: z.string().min(1, "This field is required"),

    amount_expended_usd: z.string().min(1, "This field is required"),
    expenditure_rate_ngn: z.string().min(1, "This field is required"),
});

export type TActivityTrackerFormValues = z.infer<typeof ActivityTrackerSchema>;

export type TActivityTrackerResult = {
    id: "497f6eca-6276-4993-bfeb-53cbbbba6f08";
    objectives: string;
    location: string
    lead_dept: string
    lead_partner: string
    created_datetime: "2019-08-24T14:15:22Z";
    updated_datetime: "2019-08-24T14:15:22Z";
    activity_name: string
    activity_reference_number: string
    month: string
    ir: string
    activity_frequency: string
    planned_output: string
    output_description: string
    achieved_output: string
    achievement_percentage: string;
    status: "PENDING";
    total_amount_ngn: string;
    total_amount_usd: string;
    expended_amount_ngn: string;
    implementation_usd_rate: string;
    amount_expended_usd: string;
    expenditure_rate_usd: string;
    variance_ngn: string;
    variance_usd: string;
    percentage_variance_ngn: string;
    percentage_variance_usd: string;
    efficiency_output_expenditure_ratio: string;
    efficiency_output_expenditure_level: string;
    comments: string
};
