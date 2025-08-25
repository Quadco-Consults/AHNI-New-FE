import { z } from "zod";

export const AgreementSchema = z.object({
    provider: z.string().min(1, "Please enter provider"),
    type: z.string().min(1, "Please select type"),
    start_date: z.string().min(1, "Please select start date"),
    end_date: z.string().min(1, "Please select end date"),
});

export type TAgreementFormData = z.infer<typeof AgreementSchema>;

export interface IAgreementPaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    provider: string;
    service: string;
    type: string;
    start_date: string;
    end_date: string;
    created_by: string | null;
    updated_by: string | null;
}

export interface IAgreementSingleData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    provider: string;
    service: string;
    type: string;
    start_date: string;
    end_date: string;
    created_by: string | null;
    updated_by: string | null;
}
