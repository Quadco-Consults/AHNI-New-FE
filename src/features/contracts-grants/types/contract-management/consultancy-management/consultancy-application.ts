import { z } from "zod";

export const ConsultancyStaffSchema = z.object({
    consultancy: z.string().optional(),
    referee_one: z.object({
        name: z.string().min(1, "Field Required"),
        email: z.string().min(1, "Field Required").email("Enter a valid email address"),
        phone_number: z.string().min(1, "Field Required"),
        designation: z.string().min(1, "Field Required"),
        address: z.string().min(1, "Field Required"),
    }),
    referee_two: z.object({
        name: z.string().min(1, "Field Required"),
        email: z.string().min(1, "Field Required").email("Enter a valid email address"),
        phone_number: z.string().min(1, "Field Required"),
        designation: z.string().min(1, "Field Required"),
        address: z.string().min(1, "Field Required"),
    }),
    next_of_kin: z.object({
        name: z.string().min(1, "Field Required"),
        address: z.string().min(1, "Field Required"),
        phone_number: z.string().min(1, "Field Required"),
        relationship: z.string().min(1, "Field Required"),
    }),
    name: z.string().min(1, "Field Required"),
    contractor_name: z.string().optional(),
    email: z.string().min(1, "Field Required").email("Enter a valid email address"),
    phone_number: z.string().min(1, "Field Required"),
    position_under_contract: z.string().min(1, "Field Required"),
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
            proficiency_writing: z.string().min(1, "Field Required"),
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
    average_score?: number; // Backend calculated average score (total of all criteria)
    scores?: any; // Alternative score field name
    interview_score?: any; // Alternative singular score field name
    evaluationScores?: any; // Alternative evaluation scores field name
    // Multi-scorer system fields
    average_scores?: {
        relevant_experience?: number;
        similar_work_experience?: number;
        project_management_knowledge?: number;
        recent_experience?: number;
        comparable_projects?: number;
        communication_skills?: number;
        technical_skill?: number;
        relevant_qualification?: number;
        academic_credentials?: number;
        timeline_management?: number;
        toolset_framework?: number;
        total?: number;
        percentage?: number;
    };
    total_interviewers?: number;
    completed_evaluations?: number;
    // Interview data fields
    interview_data?: any[]; // Array of interview records from separate API
    interviews?: any[]; // Alternative field name for interview records
    total_score?: number; // Direct total score on applicant
    interview_date?: string; // Interview date field
    date?: string; // Alternative date field
    interview_scores?: {
        relevant_experience?: number;
        similar_work_experience?: number;
        project_management_knowledge?: number;
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
    // Interview schedule fields
    schedule_id?: string;
    schedule?: ConsultancyInterviewSchedule;
    has_interview?: boolean; // Flag set by parent component indicating if interview exists
    // Adhoc-specific fields (optional)
    gender?: string | null;
    state_of_origin?: string | null;
    health_facility?: string | null;
    spoke_site_name?: string | null;
    lga?: string | null;
    qmap_backstop?: string | null;
    programs_officer?: string | null;
    stl?: string | null;
    seo?: string | null;
    lga2?: string | null;
    cluster?: string | null;
    account_name?: string | null;
    bank_name?: string | null;
    account_number?: string | null;
    sort_code?: string | null;
}

// Individual interviewer's score for a consultancy applicant
export interface ConsultancyInterviewScore {
    id: string;
    interview: string; // Backend confirmed: "interview" not "interview_id"
    interviewer: string; // Backend confirmed: "interviewer" not "interviewer_id"
    interviewer_name?: string;
    interviewer_email?: string;

    // Rating scores (1-4 scale for consultancy) - Backend confirmed all 11 criteria
    relevant_experience: number;
    similar_work_experience: number;
    project_management_knowledge: number;
    recent_experience: number;
    comparable_projects: number;
    communication_skills: number;
    technical_skill: number;
    relevant_qualification: number;
    academic_credentials: number;
    timeline_management: number;
    toolset_framework: number;

    // Overall evaluation - Backend calculates these automatically
    total_score?: number; // Backend calculated sum
    percentage_score?: number; // Backend calculated percentage

    // Metadata
    submitted_at?: string;
    status: 'PENDING' | 'SUBMITTED';
    created_datetime?: string;
    updated_datetime?: string;
}

// Interview schedule for consultancy interviews
export interface ConsultancyInterviewSchedule {
    id: string;
    applicant: {
        id: string;
        name: string; // Backend confirmed: "name" not "applicant_name"
        email: string;
        phone_number: string;
        position_under_contract: string; // Backend confirmed field name
    };
    interview_type: 'COMMITTEE' | 'NON_COMMITTEE';
    committee_members: string[]; // Backend confirmed: "committee_members" not "interviewers"
    committee_members_details?: Array<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    }>;
    date: string; // Backend confirmed: single "date" field not "interview_date"
    location?: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

    // Multi-scorer tracking
    total_interviewers: number;
    completed_evaluations: number;
    pending_evaluations: number;
    evaluation_completion_percentage?: number;

    created_at?: string;
    created_by?: string;
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
    // Legacy single-interviewer fields (for backward compatibility)
    interview_scores?: {
        relevant_experience?: number;
        similar_work_experience?: number;
        project_management_knowledge?: number;
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
    // Multi-scorer fields
    interview_type?: 'COMMITTEE' | 'NON_COMMITTEE';
    scores?: ConsultancyInterviewScore[]; // All individual scores
    average_scores?: {
        relevant_experience: number;
        similar_work_experience: number;
        project_management_knowledge: number;
        recent_experience: number;
        comparable_projects: number;
        communication_skills: number;
        technical_skill: number;
        relevant_qualification: number;
        academic_credentials: number;
        timeline_management: number;
        toolset_framework: number;
        total: number;
        percentage: number;
    };
    total_interviewers?: number;
    completed_evaluations?: number;
    schedule_id?: string;
    schedule?: ConsultancyInterviewSchedule;
    status: string;
    type: string;
    offer_accepted: boolean;
    offer_acceptance_date: string | null;
    acceptance_country?: string;
    acceptance_city?: string;
    acceptance_date?: string;
    acceptance_confirmed_name?: string;
    acceptance_ip_address?: string;
    acceptance_timestamp?: string;
    created_by: string;
    updated_by: null;
}
