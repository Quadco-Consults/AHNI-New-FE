import { z } from "zod";

export const LocationSchema = z.object({
    name: z.string().min(1, "Field Required"),
    address: z.string().min(1, "Field Required"),
    city: z.string().min(1, "Field Required"),
    state: z.string().min(1, "Field Required"),
    email: z.string().min(1, "Field Required"),
    phone: z.string().min(1, "Field Required"),
});

export type TLocationFormValues = z.infer<typeof LocationSchema>;

export interface TLocationData {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    address: string;
    city: string;
    state: string;
    email: string;
    phone: string;
    unique_code?: string;
}
