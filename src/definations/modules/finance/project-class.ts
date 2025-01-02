import { z } from "zod";

export const ProjectClassSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
    code: z.string().min(1, "Field Required"),
});

export type TProjectClassFormValues = z.infer<typeof ProjectClassSchema>;

export interface TProjectClassData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}
