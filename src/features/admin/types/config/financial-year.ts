import { z } from "zod";

export const FinancialYearSchema = z.object({
    year: z.string().min(1, "Year is required"),
    is_current: z.boolean().optional(),
});

export type TFinancialYearFormValues = z.infer<typeof FinancialYearSchema>;

export interface TFinancialYearData {
    id: string;
    created_at: string;
    updated_at: string;
    year: string; // e.g., "2024-2025"
    is_current: boolean;
    // Legacy fields for backward compatibility
    created_datetime?: string;
    updated_datetime?: string;
    dyanmic_order?: string;
    current?: string;
}
