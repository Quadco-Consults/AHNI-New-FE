import { z } from "zod";

export const GradeSchema = z.object({
    name: z.string().min(1, "Field is Required"),
    description: z.string().optional(),
});

export type TGradeFormValues = z.infer<typeof GradeSchema>;

export interface TGradeData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}