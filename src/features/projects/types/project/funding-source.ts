import { z } from "zod";

export const FundingSourceSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TFundingSourceFormValues = z.infer<typeof FundingSourceSchema>;

export interface TFundingSourceData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}
