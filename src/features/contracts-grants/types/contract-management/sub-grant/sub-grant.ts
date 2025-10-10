import { z } from "zod";
import { IGrantSingleData } from "../../grants";
import { TPartnerData } from "definations/modules/project/partners";
import { IUser } from "definations/auth/user";
import { TLocationData } from "definations/modules/config/location";

export const SubGrantSchema = z.object({
    project: z.string().min(1, "Please select project"),
    title: z.string().min(1, "Please enter title"),
    award_type: z.string().min(1, "Please select award type"),
    amount_usd: z.string().min(1, "Please enter amount in USD"),
    amount_ngn: z.string().min(1, "Please enter amount in NGN"),
    start_date: z.string().min(1, "Please select sub-grant start date"),
    end_date: z.string().min(1, "Please select sub-grant end date"),
    submission_start_date: z.string().min(1, "Please select submission start date"),
    submission_end_date: z.string().min(1, "Please select submission end date"),
    sub_grant_administrator: z.string().min(1, "Please select administrator"),
    technical_staff: z.string().min(1, "Please select technical staff"),
    business_unit: z.string().min(1, "Please select department"),
    locations: z.array(z.string()).nonempty("Please select at least one location"),
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
    business_unit: string | { id: string; name: string; [key: string]: any };
    amount_usd: string;
    amount_ngn: string;
    start_date: string;
    end_date: string;
    submission_start_date: string;
    submission_end_date: string;
    tender_type: string;
    assessment_date: string;
    status: string;
    created_by: string | null;
    updated_by: string | null;
    grant: string;
    locations: TLocationData[] | string[];
}

export interface ISubGrantSingleData {
    id: string;
    grant: IGrantSingleData;
    project?: any;
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
    status: string;
    created_by: string | null;
    updated_by: string | null;
    locations: TLocationData[];
    modifications?: any[];
    total_expenditure_amount?: string | number;
    total_obligation_amount?: string | number;
    current_month_obligation_amount?: string | number;
    remaining_award_amount?: string | number;
}

export const SubGrantSubmissionSchema = z.object({
    partner: z.string().min(1, "Please select partner"),
    organisation_name: z.string().min(1, "Please enter organization name"),
    principal_one_name: z.string().min(1, "Please enter 1st principal name"),
    principal_one_designaation: z
        .string()
        .min(1, "Please enter principal one designation"),
    principal_two_name: z
        .string()
        .min(1, "Please enter principal one two name"),
    principal_two_designation: z
        .string()
        .min(1, "Please enter principal two designation"),
    address: z.string().min(1, "Please enter address"),
    phone_number: z.union([
        z.string().min(1, "Please enter phone number"),
        z.number()
    ]).transform((val) => String(val)),
    fax: z.union([
        z.string().min(1, "Please enter fax"),
        z.number()
    ]).transform((val) => String(val)),
    email: z
        .string()
        .min(1, "Please enter email")
        .email("Please enter a valid email"),
    web_address: z
        .string()
        .min(1, "Please enter website")
        .transform((val) => {
            // Auto-fix common URL mistakes
            if (val && !val.match(/^https?:\/\//i)) {
                // If it starts with http// or https// (missing colon), fix it
                if (val.match(/^https?\/\//i)) {
                    return val.replace(/^(https?)\/\//i, '$1://');
                }
                // If no protocol at all, add https://
                return `https://${val}`;
            }
            return val;
        })
        .refine((val) => {
            try {
                new URL(val);
                return true;
            } catch {
                return false;
            }
        }, "Please enter a valid web address"),
    duns_number: z.union([
        z.string().min(1, "Please enter duns number"),
        z.number()
    ]).transform((val) => String(val)),
    has_conflict_of_interest: z.string().min(1, "Please select an option"),
    organisation_type: z.enum(["FOR_PROFIT", "NON_PROFIT", "GOVERNMENT", "UNIVERSITY", "OTHER"], {
        required_error: "Please select organization type",
        invalid_type_error: "Please select a valid organization type",
    }),
});

export type TSubGrantSubmissionFormData = z.infer<
    typeof SubGrantSubmissionSchema
>;

export interface ISubGrantSubmissionPaginatedData {
    id: string;
    partner: string;
    sub_grant: string | ISubGrantPaginatedData;
    sub_grant_id: string;
    created_datetime: string;
    updated_datetime: string;
    organisation_name: string;
    organisation_type: string;
    principal_one_name: string;
    principal_one_designaation: string;
    principal_two_name: string;
    principal_two_designation: string;
    address: string;
    phone_number: string;
    fax: string;
    email: string;
    web_address: string;
    duns_number: string;
    has_conflict_of_interest: boolean;
    created_by: string;
    updated_by: string | null;
    status?: string;
    is_shortlisted?: boolean;
    has_assessment?: boolean;
    assessment_score?: number;
}

export interface ISubGrantSubmissionSingleData {
    id: string;
    partner: TPartnerData;
    sub_grant: ISubGrantSingleData;
    documents: [];
    created_datetime: string;
    updated_datetime: string;
    organisation_name: string;
    organisation_type: string;
    principal_one_name: string;
    principal_one_designaation: string;
    principal_two_name: string;
    principal_two_designation: string;
    address: string;
    phone_number: string;
    fax: string;
    email: string;
    web_address: string;
    duns_number: string;
    has_conflict_of_interest: boolean;
    created_by: string;
    updated_by: string | null;
}
