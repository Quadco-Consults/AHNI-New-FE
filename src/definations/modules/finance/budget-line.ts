import { z } from "zod";

export const BudgetLineSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
    code: z.string().min(1, "Field Required"),
});

export type TBudgetLineFormValues = z.infer<typeof BudgetLineSchema>;

export interface TBudgetLineData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}
