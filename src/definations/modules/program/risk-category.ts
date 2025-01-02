import { z } from "zod";

export const RiskCategorySchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TRiskCategoryFormValues = z.infer<typeof RiskCategorySchema>;

export interface TRiskCategoryData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}
