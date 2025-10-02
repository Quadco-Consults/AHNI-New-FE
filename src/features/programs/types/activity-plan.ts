import { z } from "zod";

export const ActivityPlanSchema = z.object({
    ir: z.string().optional(),
    activity_code: z.string().optional(),
    activity_description: z.string().min(1, "This field is required"),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    responsible_person: z.string().optional(),
    resources_required: z.string().optional().nullable(),
    memo_approved: z.boolean().optional(),
    ea_required: z.boolean().optional(),
    achieved_results: z.string().optional().nullable(),
    follow_up_actions: z.string().optional().nullable(),
    comments: z.string().optional().nullable(),
    project: z.string().min(1, "This field is required"),

    // Keep old field names for backward compatibility
    is_resources_requied: z.string().optional(),
    is_memo_required: z.string().optional(),
    is_ea_required: z.string().optional(),
    is_results_achieved: z.string().optional(),
    follow_up_action: z.string().optional(),
});

export type TActivityPlanFormValues = z.infer<typeof ActivityPlanSchema>;

export interface TActivityPlanData {
    id: string;
    work_plan_title: string;
    work_plan_activity_identifier: string;
    created_datetime: string;
    updated_datetime: string;
    is_unplanned: boolean;
    activity_name: string;
    activity_description: string;
    justification: string;
    urgency_level: string | null;
    approval_status: string;
    approval_date: string | null;
    start_date: string | null;
    end_date: string | null;
    resources_required: string | null;
    expected_results: string | null;
    achieved_results: string | null;
    comments: string | null;
    follow_up_actions: string | null;
    driver_vehicle: string | null;
    ea_required: boolean;
    memo_approved: boolean;
    status: string;
    work_plan: string;
    work_plan_activity: string;
    project: string | null;
    approved_by: string | null;
    // Additional fields that may exist
    ir?: string;
    activity_code?: string;
    responsible_person?: string;
    is_resources_requied?: boolean;
    is_memo_required?: boolean;
    is_ea_required?: boolean;
    is_results_achieved?: boolean;
    follow_up_action?: string;
    created_by?: string;
    updated_by?: string;
    objectives_sub_objectives?: string;
    budget_line?: string;
    month?: string;
    expected_result?: string;
    achievement_percentage?: number;
    achieved_output?: string;
    planned_output?: string;
    location?: string;
    lead_dept?: string;
}
