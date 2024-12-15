import { z } from "zod";

export const PrequalificationCategorySchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TPrequalificationCategoryFormValues = z.infer<
    typeof PrequalificationCategorySchema
>;

export interface TPrequalificationCategoryData {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}
