import { z } from "zod";

export const CostInputSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
    code: z.string().min(1, "Field Required"),
});

export type TCostInputFormValues = z.infer<typeof CostInputSchema>;

export interface TCostInputData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}
