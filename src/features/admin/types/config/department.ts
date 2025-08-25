import { z } from "zod";

export const DepartmentSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
});

export type TDepartmentFormValues = z.infer<typeof DepartmentSchema>;

export interface TDepartmentData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}
