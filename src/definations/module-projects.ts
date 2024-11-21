import { z } from "zod";

export const fundingSourceSchema = z.object({
    description: z.string(),
    name: z.string(),
    id: z.string().optional(),
});

export const beneficiariesSchema = z.object({
    description: z.string(),
    name: z.string(),
});
export const documentTypesSchema = z.object({
    description: z.string(),
    name: z.string(),
});
export const parternersSchema = z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    phone: z.string(),
    email: z.string(),
    website: z.string(),
});

export type TFundingSource = z.infer<typeof fundingSourceSchema>;
export type TBeneficiaries = z.infer<typeof beneficiariesSchema>;
export type TDocumentTypes = z.infer<typeof documentTypesSchema>;
export type TPartners = z.infer<typeof parternersSchema>;

export interface FundingSource {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}

export interface Beneficiaries {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}

export interface DocumentTypes {
    id: string;
    name: string;
    description: string;
}

export interface Partners {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    address: string;
    city: string;
    state: string;
    email: string;
    phone: string;
    website: string;
    logo: string;
}
