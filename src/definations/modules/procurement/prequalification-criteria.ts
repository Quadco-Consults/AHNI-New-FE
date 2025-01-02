import { z } from "zod";

export const PrequalificationCriteriaSchema = z.object({
    name: z.string().min(1, "Field is required"),
    description: z.string().optional(),
    category: z.string().min(1, "Field is required"),
});

export type TPrequalificationCriteriaFormValues = z.infer<
    typeof PrequalificationCriteriaSchema
>;

export interface TPrequalificationCriteriaData {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
    category: string;
}
