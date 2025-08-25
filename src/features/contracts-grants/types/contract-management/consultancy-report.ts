import { z } from "zod";
import { IConsultantSingleData } from "./consultancy-management/consultancy-management";
import { IUser } from "definations/auth/user";

export const ConsultancyReportSchema = z.object({
    supervisor: z.string().min(1, "Please select supervisor"),
    consultant: z.string().min(1, "Please select consultant"),
    report_date: z.string().min(1, "Please select report date"),
    consultancy_start_date: z.string().min(1, "Please select start date"),
    consultancy_end_date: z.string().min(1, "Please select end date"),
    consultancy_duration: z.string().min(1, "Please enter duration"),
    purpose: z.string().min(1, "Please enter purpose"),
    executive_summary: z.string().min(1, "Please enter executive summary"),
    achievements: z.string().min(1, "Please enter activities"),
    challenges_recommendations: z
        .string()
        .min(1, "Please enter challenges and recommendations"),
});

export type TConsultancyReportFormData = z.infer<
    typeof ConsultancyReportSchema
>;

export interface IConsultancyReportPaginatedData {
    id: string;
    consultant: string;
    supervisor: string;
    created_datetime: string;
    updated_datetime: string;
    report_date: string;
    consultancy_start_date: string;
    consultancy_end_date: string;
    consultancy_duration: number;
    purpose: string;
    executive_summary: string;
    achievements: string;
    challenges_recommendations: string;
    status: string;
    approved_datetime: null;
    rejected_datetime: null;
    created_by: null;
    updated_by: null;
    approved_by: null;
    rejected_by: null;
}

export interface IConsultancyReportSingleData {
    id: string;
    consultant: IConsultantSingleData;
    supervisor: IUser;
    created_datetime: string;
    updated_datetime: string;
    report_date: string;
    consultancy_start_date: string;
    consultancy_end_date: string;
    consultancy_duration: number;
    purpose: string;
    executive_summary: string;
    achievements: string;
    challenges_recommendations: string;
    status: string;
    approved_datetime: null;
    rejected_datetime: null;
    created_by: null;
    updated_by: null;
    approved_by: null;
    rejected_by: null;
}
