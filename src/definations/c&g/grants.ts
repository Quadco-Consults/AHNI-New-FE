import { IProjectSingleData } from "definations/project";
import { z } from "zod";

export const GrantSchema = z.object({
    project: z.string().min(1, "Please select project"),
    award_type: z.string().min(1, "Please select award type"),
    award_amount: z.string().min(1, "Please enter award amount"),
    reference_number: z.string().min(1, "Please enter reference number"),
});

export type TGrantFormData = z.infer<typeof GrantSchema>;

export interface IGrantPaginatedData {
    id: string;
    project: string;
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
