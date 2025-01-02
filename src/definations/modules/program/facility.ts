import { z } from "zod";

export const FacilitySchema = z.object({
    name: z.string().min(1, "Field Required"),
    email: z.string().min(1, "Field Required"),
    contact_person: z.string().min(1, "Field Required"),
    postion: z.string().min(1, "Field Required"),
    state: z.string().min(1, "Field Required"),
    lga: z.string().min(1, "Field Required"),
    phone: z.string().min(1, "Field Required"),
});

export type TFacilityFormValues = z.infer<typeof FacilitySchema>;

export interface TFacilityData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    contact_person: string;
    postion: string;
    state: string;
    email: string;
    phone: string;
    lga: string;
}
