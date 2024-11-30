import { z } from "zod";

export const influenceEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const commitmentLevelEnum = z.enum([
    "UNAWARE",
    "AGAINST",
    "NEUTRAL",
    "PHONE_SUPPORT",
    "LEADING",
]);

export const EngagementPlanSchema = z.object({
    project: z.string().min(1, "This field is required"),
    project_deliverables: z.string().min(1, "This field is required"),
    project_manager: z.string().min(1, "This field is required"),

    start_date: z.string().min(1, "Ths field is required"),
    end_date: z.string().min(1, "Ths field is required"),
    stakeholders: z.array(
        z.object({
            influence: influenceEnum,
            information_type: z.string().min(1, "This field is required"),
            decision_maker: z.string().min(1, "This field is required"),
            frequency: z.string().min(1, "This field is required"),
            type: z.string().min(1, "This field is required"),
            commitment_level: commitmentLevelEnum,
            stakeholder: z.string().min(1, "This field is required"),
        })
    ),
});

export type TEngagementPlanFormValue = z.infer<typeof EngagementPlanSchema>;
export type TEngagementPlanResponse = TEngagementPlanFormValue & {
    id: string;
};
