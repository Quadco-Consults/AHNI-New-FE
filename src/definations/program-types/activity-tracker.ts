import { z } from "zod";

export const ActivityTrackerSchema = z.object({
    output_description: z.string().min(1, "This field is required"),
    achieved_output: z.string().min(1, "This field is required"),
    achievement_percentage: z.string().min(1, "This field is required"),
    amount_expended_ngn: z.string().min(1, "This field is required"),
    amount_expended_usd: z.string().min(1, "This field is required"),
    implementation_usd_rate: z.string().min(1, "This field is required"),
    expenditure_usd_rate: z.string().min(1, "This field is required"),
    expenditure_ngn_rate: z.string().min(1, "This field is required"),
    variance_ngn: z.string().min(1, "This field is required"),
    variance_usd: z.string().min(1, "This field is required"),
    percentage_variance_ngn: z.string().min(1, "This field is required"),
    percentage_variance_usd: z.string().min(1, "This field is required"),
    efficiency_output_expenditure_ratio: z
        .string()
        .min(1, "This field is required"),
    efficiency_output_expenditure_level: z
        .string()
        .min(1, "This field is required"),
    comments: z.string().min(1, "Field Required"),
});

export type TActivityTrackerFormValues = z.infer<typeof ActivityTrackerSchema>;

export type TActivityTrackerResult = {
    id: string;
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
};
