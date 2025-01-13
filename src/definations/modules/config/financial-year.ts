import { z } from "zod";

export const FinancialYearSchema = z.object({
    year: z.string().min(1, "Field Required"),
});

export type TFinancialYearFormValues = z.infer<typeof FinancialYearSchema>;

export interface TFinancialYearData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    year: string;
    dyanmic_order: string;
    current: string;
}
