import { z } from "zod";
export const categorySchema = z.object({
    code: z.string(),
    name: z.string(),
    description: z.string(),
    serial_number: z.string(),
    job_category: z.enum(["GOODS", "SERVICE", "WORK", "OTHERS"]),
});
export const departmentsSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
});
export const financialYearSchema = z.object({
    year: z.string().min(1, "Please enter year"),
    dyanmic_order: z.string().min(1, "Please enter dynamic order"),
    current: z.enum(["false", "true"]),
});
export const itemsSchema = z.object({
    name: z.string(),
    description: z.string(),
    uom: z.string(),
    category: z.string(),
});
export const locationsSchema = z.object({
    name: z.string(),
    address: z.string(),
    city: z.string().optional(),
    state: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
});

export const PositionSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
});

export type TPositionFormValues = z.infer<typeof PositionSchema>;

export type TCategories = z.infer<typeof categorySchema>;
export type TDepartments = z.infer<typeof departmentsSchema>;
export type TFinancialYear = z.infer<typeof financialYearSchema>;
export type TItems = z.infer<typeof itemsSchema>;
export type TLocations = z.infer<typeof locationsSchema>;

export interface Categories {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
    job_category: string;
    serial_number: string;
    code: string;
}

export interface Departments {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
}

export interface FinancialYear {
    created_at: string;
    updated_at: string;
    id: string;
    year: string;
    current: boolean;
    dyanmic_order: number;
}

export interface Items {
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
    uom: string;
    category: string;
}

export interface Locations {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    address: string;
    city: string;
    state: string;
    email: string;
    phone: string;
}

export interface Position {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
}
