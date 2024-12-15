import { z } from "zod";

export const SolicitationEvaluationCriteriaSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TSolicitationEvaluationCriteriaFormValues = z.infer<
    typeof SolicitationEvaluationCriteriaSchema
>;

export interface TSolicitationEvaluationCriteriaData {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}
