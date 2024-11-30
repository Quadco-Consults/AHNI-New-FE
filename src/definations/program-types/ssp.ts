import { z } from "zod";

export const SSPSchema = z.object({
    facility: z.string().min(1, "This field is required"),
    month: z.string().min(1, "This field is required"),
    year: z.string().min(1, "This field is required"),
    team_members: z.array(z.string().min(1, "This field is required")),
    visit_date: z.string().min(1, "This field is required"),
    status: z.string().min(1, "This field is required"),
});

export type TSSSPFormValues = z.infer<typeof SSPSchema>;

export interface TSSPResponse {
    id: string;
    facility: string;
    team_members: string[];
    created_datetime: string;
    updated_datetime: string;
    month: string;
    year: string;
    visit_date: string;
    status: string;
    objectives: string[];
}
