import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const GrantSchema = z.object({
    name: z.string().min(1, "Please select project"),
    grant_id: z.string().min(1, "Please select project"),
    award_type: z.string().min(1, "Please select award type"),
    award_amount: z.string().min(1, "Please enter award amount"),
    reference_number: z.string().min(1, "Please enter reference number"),
});

export type TGrantFormData = z.infer<typeof GrantSchema>;

export interface IGrantPaginatedData {
    id: string;
    grant_id: string;
    name: string;
    status: string;
    funding_sources: string[];
    beneficiaries: string[];
    current_month_expenditure_amount: string | null;
    current_month_obligation_amount: string | null;
    total_obligation_amount: string;
    total_expenditure_amount: string;
    created_datetime: string;
    updated_datetime: string;
    award_type: string;
    award_amount: string;
    reference_number: string;
    created_by: string;
    updated_by: null;
}

export interface IGrantSingleData {
    id: string;
    project: IProjectSingleData;
    created_datetime: string;
    updated_datetime: string;
    award_type: string;
    award_amount: string;
    reference_number: string;
    created_by: string;
    updated_by: null;
    total_obligation_amount: string | null;
    total_expenditure_amount: string | null;
}

export const ExpenditureSchema = z.object({
    amount: z.string().min(1, "Please enter amount"),
    description: z.string().min(1, "Please enter description"),
});

export type TExpenditureFormData = z.infer<typeof ExpenditureSchema>;

export interface IExpenditurePaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    description: string;
    amount: string;
    created_by: null;
    updated_by: null;
    grant: string;
}

export interface IExpenditureSingleData {}

export const ObligationSchema = z.object({
    amount: z.string().min(1, "Please enter amount"),
    description: z.string().min(1, "Please enter description"),
});

export type TObligationFormData = z.infer<typeof ObligationSchema>;

export interface IObligationPaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    description: string;
    amount: string;
    created_by: null;
    updated_by: null;
    grant: string;
}

export interface IObligationSingleData {}
