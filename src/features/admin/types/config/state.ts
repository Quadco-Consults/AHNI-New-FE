import { z } from "zod";

export const StateSchema = z.object({
    name: z.string().min(1, "State name is required"),
    code: z.string().min(2, "State code is required").max(10, "State code too long"),
    capital: z.string().min(1, "Capital city is required"),
    zone: z.string().min(1, "Geopolitical zone is required"),
    lgas: z.number().min(1, "Number of LGAs is required"),
    is_active: z.boolean().optional().default(true),
});

export type TStateFormValues = z.infer<typeof StateSchema>;

export interface TStateData {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    code: string;
    capital: string;
    zone: string;
    lgas: number;
    is_active: boolean;
}

export interface StateResultsData extends TStateData {}

// Legacy type exports for backward compatibility
export type StateData = TStateData;
export type StateFormValues = TStateFormValues;