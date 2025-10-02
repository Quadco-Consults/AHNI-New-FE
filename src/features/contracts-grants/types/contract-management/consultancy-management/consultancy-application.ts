import { z } from "zod";

export const ConsultancyStaffSchema = z.object({
    consultancy: z.string().optional(),
    referees: z.array(
        z.object({
            name: z.string().min(1, "Field Required"),
            email: z.string().min(1, "Field Required"),
            phone_number: z.string().min(1, "Field Required"),
        })
    ),
    name: z.string().min(1, "Field Required"),
    contractor_name: z.string().optional(),
    email: z.string().min(1, "Field Required"),
    phone_number: z.string().min(1, "Field Required"),
    position_under_contract: z.string().min(1, "Field Required"),
    place_of_birth: z.string().min(1, "Field Required"),
    citizenship: z.string().min(1, "Field Required"),
    start_duration_date: z.string().min(1, "Field Required"),
    end_duration_date: z.string().min(1, "Field Required"),
    education: z.array(
        z.object({
            name: z.string().min(1, "Field Required"),
            location: z.string().min(1, "Field Required"),
            major: z.string().min(1, "Field Required"),
            degree: z.string().min(1, "Field Required"),
            date: z.string().min(1, "Field Required"),
        })
    ),
    language_proficiency: z.array(
        z.object({
            language: z.string().min(1, "Field Required"),
            proficiency_speaking: z.string().min(1, "Field Required"),
            proficiency_reading: z.string().min(1, "Field Required"),
        })
    ),
    employment_history: z.array(
        z.object({
            position_title: z.string().min(1, "Field Required"),
            employer_name: z.string().min(1, "Field Required"),
            employer_telephone: z.string().min(1, "Field Required"),
            from: z.string().min(1, "Field Required"),
            to: z.string().min(1, "Field Required"),
        })
    ),
    special_consultant_services: z.array(
        z.object({
            services_performed: z.string().min(1, "Field Required"),
            employer_name: z.string().min(1, "Field Required"),
            employer_telephone: z.string().min(1, "Field Required"),
            from: z.string().min(1, "Field Required"),
            to: z.string().min(1, "Field Required"),
        })
    ),
});

export const ExistingApplicantSchema = z.object({
    applicant: z.string().min(1, "Please select an applicant"),
    consultancy: z.string(),
});

export type TExistingApplicantFormData = z.infer<
    typeof ExistingApplicantSchema
>;

export type TConsultancyStaffFormData = z.infer<typeof ConsultancyStaffSchema>;

export interface IConsultancyStaffPaginatedData {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    name: string;
    contractor_name: string;
    email: string;
    phone_number: string;
    contract_number: string;
    position_under_contract: string;
    proposed_salary: string;
    place_of_birth: string;
    address: null;
    citizenship: string;
    start_duration_date: string;
    end_duration_date: string;
    consultants?: string[]; // ManyToMany relationship - array of consultant IDs
    consultancy?: string; // Backward compatibility
    consultant_id?: string; // Backward compatibility
    interview_scores?: {
        relevant_experience?: number;
        project_management?: number;
        recent_experience?: number;
        comparable_projects?: number;
        communication_skills?: number;
        technical_skill?: number;
        relevant_qualification?: number;
        academic_credentials?: number;
        timeline_management?: number;
        toolset_framework?: number;
        total_score?: number;
        interview_date?: string;
    };
    education: {
        date: string;
        name: string;
        major: string;
        degree: string;
        location: string;
    }[];
    language_proficiency: {
        language: string;
        proficiency_reading: string;
        proficiency_speaking: string;
    }[];
    employment_history: {
        to: string;
        from: string;
        employer_name: string;
        position_title: string;
        employer_telephone: string;
    }[];
    special_consultant_services: {
        to: string;
        from: string;
        employer_name: string;
        employer_telephone: string;
        services_performed: string;
    }[];
    status: string;
    technical_monitor_user: null;
    location: null;
    project: null;
    contract_request: null;
    type: string;
    technical_monitor_partner_name: null;
    technical_monitor_partner_email: null;
    technical_monitor_partner_phone: null;
    offer_accepted: boolean;
    offer_acceptance_date: null;
    signature: null;
    created_by: string;
    updated_by: string | null;
}

export interface IConsultancyStaffSingleData {
    id: string;
    referees: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        name: string;
        email: string;
        phone_number: string;
        applicant: string;
    }[];
    documents: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        name: string;
        document: string;
        applicant: string;
    }[];
    created_datetime: string;
    updated_datetime: string;
    name: string;
    contractor_name: string;
    email: string;
    phone_number: string;
    contract_number: string;
    position_under_contract: string;
    proposed_salary: string;
    place_of_birth: string;
    address: null;
    citizenship: string;
    start_duration_date: string;
    end_duration_date: string;
    education: {
        date: string;
        name: string;
        major: string;
        degree: string;
        location: string;
    }[];
    language_proficiency: {
        language: string;
        proficiency_reading: string;
        proficiency_speaking: string;
    }[];
    employment_history: {
        to: string;
        from: string;
        employer_name: string;
        position_title: string;
        employer_telephone: string;
    }[];
    special_consultant_services: {
        to: string;
        from: string;
        employer_name: string;
        employer_telephone: string;
        services_performed: string;
    }[];
    interview_scores?: {
        relevant_experience?: number;
        project_management?: number;
        recent_experience?: number;
        comparable_projects?: number;
        communication_skills?: number;
        technical_skill?: number;
        relevant_qualification?: number;
        academic_credentials?: number;
        timeline_management?: number;
        toolset_framework?: number;
        total_score?: number;
        interview_date?: string;
    };
    created_by: string;
    updated_by: null;
}
