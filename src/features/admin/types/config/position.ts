import { z } from "zod";

export const PositionSchema = z.object({
    name: z.string().min(1, "Field is Required"),
    description: z.string().optional(),
});

export type TPositionFormValues = z.infer<typeof PositionSchema>;

export interface TPositionData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}
