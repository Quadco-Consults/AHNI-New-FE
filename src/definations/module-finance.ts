import { z } from "zod";

export interface CostCategory {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}

export const CostCategorySchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
    code: z.string().min(1, "Please enter a code"),
});

export type TCostCategory = z.infer<typeof CostCategorySchema>;

export interface CostInput {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}

export const CostInputSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
    code: z.string().min(1, "Please enter a code"),
});

export type TCostInput = z.infer<typeof CostInputSchema>;

export interface BudgetLine {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}

export const BudgetLineSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
    code: z.string().min(1, "Please enter a code"),
});

export type TBudgetLine = z.infer<typeof BudgetLineSchema>;

export interface FCONumber {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}

export const FCONumberSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
    code: z.string().min(1, "Please enter a code"),
});

export type TFCONumber = z.infer<typeof FCONumberSchema>;

export interface ProjectClass {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}

export const ProjectClassSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
    code: z.string().min(1, "Please enter a code"),
});

export type TProjectClass = z.infer<typeof ProjectClassSchema>;

export interface ChartAccount {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    description: string;
    code: string;
}

export const ChartAccountSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
    code: z.string().min(1, "Please enter a code"),
});

export type TChartAccount = z.infer<typeof ChartAccountSchema>;
