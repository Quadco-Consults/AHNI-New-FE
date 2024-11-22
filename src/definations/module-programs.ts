import { z } from "zod";

export const facilityContactSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    position: z.string(),
    phone_number: z.string(),
    email: z.string().email(),
});

export const facilitiesSchema = z.object({
    name: z.string().min(1, "Please enter name"),
    email: z.string().min(1, "Please enter email"),
    contact_person: z.string().min(1, "Please enter contact person"),
    postion: z.string().min(1, "Please enter position"),
    state: z.string().min(1, "Please select state"),
    lga: z.string().min(1, "Please enter LGA"),
    phone: z.string().min(1, "Please enter phone number"),
});

export const supervisionCategorySchema = z.object({
    name: z.string().min(1, "Please enter name"),
    description: z.string().min(1, "Please enter description"),
});

export const riskCategorySchema = z.object({
    description: z.string(),
    name: z.string(),
});

export type TFacilities = z.infer<typeof facilitiesSchema>;
export type TSupervisionCategory = z.infer<typeof supervisionCategorySchema>;
export type TRiskCategory = z.infer<typeof riskCategorySchema>;

export interface Facilities {
    id: string;
    name: string;
    position: string;
    phone_number: string;
    email: string;
    facility: string;
}

export interface SupervisionCategory {
    id: string;
    code: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    serial_number: number;
    job_category: string;
}

export interface RiskCategory {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}

export interface SupervisionCriteria {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}

export const SupervisionCriteriaSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
});

export type TSupervisionCriteria = z.infer<typeof SupervisionCriteriaSchema>;
