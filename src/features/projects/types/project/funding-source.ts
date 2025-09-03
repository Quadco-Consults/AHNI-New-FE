import { z } from "zod";

export const FundingSourceSchema = z.object({
    name: z.string().min(1, "Field Required"),
    description: z.string().optional(),
    email_donor: z.string().email("Invalid email").optional().or(z.literal("")),
    address_donor: z.string().optional(),
    contact_person_name: z.string().optional(),
    email_contact_person: z.string().email("Invalid email").optional().or(z.literal("")),
    contact_person_phone: z.string().optional(),
});

export type TFundingSourceFormValues = z.infer<typeof FundingSourceSchema>;

export interface TFundingSourceData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    email_donor?: string;
    address_donor?: string;
    contact_person_name?: string;
    email_contact_person?: string;
    contact_person_phone?: string;
}
