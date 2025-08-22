import { z } from "zod";

export const SupervisionCategorySchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TSupervisionCategoryFormValues = z.infer<
    typeof SupervisionCategorySchema
>;

export interface TSupervisionCategoryData {
    id: string;
    code: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    serial_number: number;
    job_category: string;
}
