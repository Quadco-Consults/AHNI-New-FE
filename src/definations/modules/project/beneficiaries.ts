import { z } from "zod";

export const BeneficiarySchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string(),
});

export type TBeneficiaryFormValues = z.infer<typeof BeneficiarySchema>;

export interface TBeneficiaryData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}
