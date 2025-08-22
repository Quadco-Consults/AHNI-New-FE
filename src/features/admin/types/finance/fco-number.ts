import { z } from "zod";

export const FCONumberSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
    code: z.string().min(1, "Field Required"),
});

export type TFCONumberFormValues = z.infer<typeof FCONumberSchema>;

export interface TFCONumberData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}
