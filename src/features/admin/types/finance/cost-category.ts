import { z } from "zod";

export const CostCategorySchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
    code: z.string().min(1, "Field Required"),
});

export type TCostCategoryFormValues = z.infer<typeof CostCategorySchema>;

export interface TCostCategoryData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}
