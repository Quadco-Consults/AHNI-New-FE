import { IUser } from "definations/auth/user";
import { TSolicitationEvaluationCriteriaData } from "definations/modules/procurement/solicitation-evaluation-criteria";
import { z } from "zod";

export const SupervisionPlanReviewSchema = z.object({
    reviews: z.array(
        z.object({
            is_selected: z
                .boolean({ required_error: "Selection is required" })
                .optional(),
            comment: z.string().min(1, "Please enter a comment"),
            objective: z.string(),
        })
    ),
    documents: z.array(
        z.object({
            title: z.string().min(1, "Please enter document title"),
            label: z.string().optional(),
            is_selected: z
                .boolean({ required_error: "Selection is required" })
                .optional(),
            document: z.any(),
            name: z.string(),
        })
    ),
    remediation_plan: z.string().min(1, "Please enter a remediation plan"),
    is_agree_on_visit_plan: z.string().min(1, "Please select an option"),
});

export type TSupervisionPlanReviewFormData = z.infer<
    typeof SupervisionPlanReviewSchema
>;

export interface ISupervisionPlanReviewPaginatedData {
    id: string;
    reviews: {
        id: string;
        objective: TSolicitationEvaluationCriteriaData;
        created_datetime: string;
        updated_datetime: string;
        is_selected: true;
        comment: string;
    }[];
    documents: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        document: string;
        is_selected: boolean;
        title: string;
    }[];
    user: IUser;
    submission_datetime: string;
    remediation_plan: string;
    is_agree_on_visit_plan: boolean;
    supportive_supervision_plan: string;
}

export interface ISupervisionPlanReviewSingleData {}
