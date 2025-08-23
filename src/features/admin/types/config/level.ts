import { z } from "zod";

export const LevelSchema = z.object({
    name: z.string().min(1, "Field is Required"),
    description: z.string().optional(),
});

export type TLevelFormValues = z.infer<typeof LevelSchema>;

export interface TLevelData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}