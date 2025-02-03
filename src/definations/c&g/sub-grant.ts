import { z } from "zod";
import { IGrantSingleData } from "./grants";
import { TPartnerData } from "definations/modules/project/partners";
import { IUser } from "definations/auth/user";

export const SubGrantSchema = z.object({
    grant: z.string().min(1, "Please select grant"),
    partners: z.array(z.string()).nonempty("Please select partner"),
    title: z.string().min(1, "Please enter title"),
    sub_grant_administrator: z.string().min(1, "Please select administrator"),
    award_type: z.string().min(1, "Please select award type"),
    technical_staff: z.string().min(1, "Please select technical staff"),
    business_unit: z.string().min(1, "Please enter business unit"),
    amount_usd: z.string().min(1, "Please enter amount in USD"),
    amount_ngn: z.string().min(1, "Please enter amount in NGN"),
    start_date: z.string().min(1, "Please select start date"),
    end_date: z.string().min(1, "Please select end date"),
    submission_start_date: z.string().min(1, "Please select opening date"),
    submission_end_date: z.string().min(1, "Please select closing date"),
    tender_type: z.string().min(1, "Please select tender type"),
    assessment_date: z.string().min(1, "Please select assessment date"),
    evaluation_applicants: z
        .array(z.string())
        .nonempty("Please select evaluation applicants"),
});

export type TSubGrantFormData = z.infer<typeof SubGrantSchema>;

export interface ISubGrantPaginatedData {
    id: string;
    grant_ref_no: string;
    project: string;
    sub_grant_administrator: string;
    technical_staff: string;
    evaluation_applicants: string[];
    created_datetime: string;
    updated_datetime: string;
    title: string;
    award_type: string;
    business_unit: string;
    amount_usd: string;
    amount_ngn: string;
    start_date: string;
    end_date: string;
    submission_start_date: string;
    submission_end_date: string;
    tender_type: string;
    assessment_date: string;
    created_by: string | null;
    updated_by: string | null;
    grant: string;
}

export interface ISubGrantSingleData {
    id: string;
    grant: IGrantSingleData;
    partners: TPartnerData[];
    sub_grant_administrator: IUser;
    technical_staff: IUser;
    evaluation_applicants: IUser[];
    created_datetime: string;
    updated_datetime: string;
    title: string;
    award_type: string;
    business_unit: string;
    amount_usd: string;
    amount_ngn: string;
    start_date: string;
    end_date: string;
    submission_start_date: string;
    submission_end_date: string;
    tender_type: string;
    assessment_date: string;
    created_by: string | null;
    updated_by: string | null;
}
