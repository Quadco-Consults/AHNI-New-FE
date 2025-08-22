import { z } from "zod";

export const SupervisionCriteriaSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
    evaluation_category: z.string().min(1, "Field Required"),
});

export type TSupervisionCriteriaFormValues = z.infer<
    typeof SupervisionCriteriaSchema
>;

export interface TSupervisionCriteriaData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    evaluation_category: string;
}
