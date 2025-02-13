import { z } from "zod";

export const SupervisionPlanReviewSchema = z.object({
    reviews: z.array(
        z.object({
            is_selected: z.boolean({ required_error: "Selection is required" }),
            comment: z.string().min(1, "Please enter a comment"),
            objective: z.string(),
        })
    ),
    // documents
    remediation_plan: z.string().min(1, "Please enter a remediation plan"),
    is_agree_on_visit_plan: z.string().min(1, "Please select an option"),
});

export type TSupervisionPlanReviewFormData = z.infer<
    typeof SupervisionPlanReviewSchema
>;

export interface ISupervisionPlanReviewPaginatedData {}

export interface ISupervisionPlanReviewSingleData {}
