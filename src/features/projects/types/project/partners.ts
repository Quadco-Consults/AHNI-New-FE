import { z } from "zod";

export const PartnerSchema = z.object({
    name: z.string().min(1, "Field Required"),
    partner_type: z.string().min(1, "Field Required"),
    address: z.string().min(1, "Field Required"),
    city: z.string().min(1, "Field Required"),
    state: z.string().min(1, "Field Required"),
    phone: z.string().min(1, "Field Required"),
    email: z.string().min(1, "Field Required"),
    website: z.string().min(1, "Field Required"),
});

export type TPartnerFormValues = z.infer<typeof PartnerSchema>;

export interface TPartnerData {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    partner_type: string;
    address: string;
    city: string;
    state: string;
    email: string;
    phone: string;
    website: string;
    logo: string;
}
