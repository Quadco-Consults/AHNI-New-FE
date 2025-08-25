import { z } from "zod";

export const ActivityPlanSchema = z.object({
    ir: z.string().min(1, "This field is required"),
    activity_code: z.string().min(1, "This field is required"),
    activity_description: z.string().min(1, "This field is required"),
    start_date: z.string().min(1, "This field is required"),
    end_date: z.string().min(1, "This field is required"),
    responsible_person: z.string().min(1, "This field is required"),
    is_resources_requied: z.string().min(1, "This field is required"),
    is_memo_required: z.string().min(1, "This field is required"),
    is_ea_required: z.string().min(1, "This field is required"),
    is_results_achieved: z.string().min(1, "This field is required"),
    follow_up_action: z.string().min(1, "This field is required"),
    comments: z.string().min(1, "This field is required"),
    project: z.string().min(1, "This field is required"),
});

export type TActivityPlanFormValues = z.infer<typeof ActivityPlanSchema>;

export interface TActivityPlanData {
    id: string;
    project: {
        id: string;
    };
    created_datetime: string;
    updated_datetime: string;
    ir: string;
    activity_code: string;
    activity_description: string;
    start_date: string;
    end_date: string;
    responsible_person: string;
    is_resources_requied: true;
    is_memo_required: true;
    is_ea_required: true;
    is_results_achieved: true;
    follow_up_action: string;
    comments: string;
    created_by: string;
    updated_by: string;
}
