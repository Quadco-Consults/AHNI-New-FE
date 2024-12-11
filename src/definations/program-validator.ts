import { z } from "zod";
import { CostCategory } from "./module-finance";

const monthly_budget = z.object({
    month: z.string(),
    frequency: z.number(),
    monthly_total: z.number(),
});

export const ProgramWorkPlanSchema = z.object({
    monthly_budget: z.array(monthly_budget),
    annual_total_in_ngn: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    identification: z.string(),
    description: z.string(),
    activity_justification: z.string(),
    lead_department: z.string(),
    lead_person: z.string(),
    unit_cost_ngn: z.number(),
    expected_result: z.string(),
    indicator: z.string(),
    mov: z.string(),
    locations: z.string(),
    approval_number: z.string(),
    comments: z.string(),
    financial_year: z.string(),
    project_objective: z.string(),
    partner: z.string(),
    project: z.string(),
});

export const ProgramActivitySchema = z.object({
    created_at: z.string(),
    updated_at: z.string(),
    objectives: z.number(),
    ir: z.string(),
    activity_code: z.string(),
    activity_description: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    responsible_person: z.string(),
    resources_required: z.string(),
    memo_required: z.string(),
    ea_required: z.string(),
    results_achieved: z.string(),
    follow_up_action: z.string(),
    comments: z.string(),
    project: z.string(),
});

export const SupportiveSupervisionSchema = z.object({
    facility: z.string(),
    month_year: z.string(),
    date_of_visit: z.string(),
    status: z.string(),
    evaluation_criteria: z.array(z.string()),
    team_members: z.array(z.string()),
});

export const SupportiveSupervisionResponseDataSchema = z.object({
    responses: z.array(
        z.object({
            supervision_response: z.string(),
            comments: z.string(),
            response_id: z.string(),
        })
    ),
});

export const FacilitySchema = z.object({
    name: z.string(),
    state: z.string(),
    local_govt: z.string(),
});

export const RiskCategoriesSchema = z.object({
    name: z.string(),
    description: z.string(),
});

export const DepartmentsSchema = z.object({
    name: z.string(),
    description: z.string(),
});

export const RiskPlanManagementSchema = z.object({
    risk_number: z.string().min(1, "This field is required"),
    risk_description: z.string().min(1, "This field is required"),
    impact_description: z.string().min(1, "This field is required"),
    impact_level: z.enum(["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]),
    occurence_probability: z.enum([
        "VERY_LOW",
        "LOW",
        "MEDIUM",
        "HIGH",
        "VERY_HIGH",
    ]),
    total_risk_on_response: z.enum([
        "VERY_LOW",
        "LOW",
        "MEDIUM",
        "HIGH",
        "VERY_HIGH",
    ]),
    risk_response: z.string().min(1, "This field is required"),
    implementation_timeline: z.enum([
        "IMMEDIATE",
        "SHORT_TERM",
        "MEDIUM_TERM",
        "LONG_TERM",
    ]),
    risk_status: z.enum(["OPEN", "CLOSED", "MITIGATED"]),
    risk_category: z.string().min(1, "This field is required"),
    risk_owner: z.string().min(1, "This field is required"),
});

export type TRiskPlanManagementFormValues = z.infer<
    typeof RiskPlanManagementSchema
>;
export type TRiskPlanPlanManagementResponse = Omit<
    TRiskPlanManagementFormValues,
    "risk_category" | "risk_owner"
> & {
    id: string;
    risk_category: {
        id: string;
        name: string;
    };
    risk_owner: {
        id: string;
        name: string;
    };
};

export const WeeklyActivitySchema = z.object({
    objectives: z.number(),
    ir: z.string(),
    activity_code: z.string(),
    activity_description: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    responsible_person: z.string(),
    resources_required: z.string(),
    memo_required: z.string(),
    ea_required: z.string(),
    results_achieved: z.string(),
    follow_up_action: z.string(),
    comments: z.string(),
    project: z.string(),
});

export const StakeholderRegisterSchema = z.object({
    name: z.string().min(1, "Field is required"),
    organization: z.string().min(1, "Field is required"),
    office_address: z.string().min(1, "Field is required"),
    state: z.string().min(1, "Field is required"),
    designation: z.string().min(1, "Field is required"),
    phone_number: z.string().min(1, "Field is required"),
    email: z.string().min(1, "Field is required").email(),
    project_role: z.string().min(1, "Field is required"),
    importance: z.enum(["1", "2", "3", "4", "5"]),
    influence: z.string().min(1, "Field is required"),
    score: z.string().min(1, "Field is required"),
    major_concerns: z.string().min(1, "Field is required"),
    relationship_owner: z.string().min(1, "Field is required"),
});

export type TStakeholderRegister = z.infer<typeof StakeholderRegisterSchema>;

export type TStakeholderRegisterResponse = Omit<
    TStakeholderRegister,
    "importance" | "influence"
> & {
    id: string;
    importance: number;
    influence: number;
};

export const StakeholderMappingSchema = z.object({
    stakeholders: z.array(
        z.object({
            project_role: z.string().min(1, "Field is required"),
            importance: z.string().min(1, "Field is required"),
            major_concerns: z.string().min(1, "Field is required"),
            influence: z.string().min(1, "Field is required"),
            score: z.string().min(1, "Field is required"),
            relationship_owner: z.string().min(1, "Field is required"),
            project: z.string().min(1, "Field is required"),
            stake_holder: z.string().min(1, "Field is required"),
        })
    ),
});

export const StakeholderSchema = z.object({
    stakeholders: z.array(
        z.object({
            project_role: z.string().min(1, "Field is required"),
            importance: z.string().min(1, "Field is required"),
            major_concerns: z.string().min(1, "Field is required"),
            influence: z.string().min(1, "Field is required"),
            score: z.string().min(1, "Field is required"),
            relationship_owner: z.string().min(1, "Field is required"),
            project: z.string().min(1, "Field is required"),
            stake_holder: z.string().min(1, "Field is required"),
        })
    ),
    submitted_stakeholders: z.array(z.string().min(1, "Field is required")),
});

export const FundRequestSchema = z.object({
    project: z.string().min(1, "Field is required"),
    month: z.string().min(1, "Field is required"),
    year: z
        .string()
        .min(4, "Field is required")
        .max(4, "Four characters required"),

    currency: z.string().min(1, "Field is required"),
    available_balance: z.string().min(1, "Field is required"),
    financial_year: z.string().min(1, "Field is required"),
    type: z.string().min(1, "Field is required"),
    location: z.string().min(1, "Field is required"),
    reviewer: z.string().min(1, "Field is required"),
    uuid_code: z.string().min(1, "Field is required"),
});

export type TFundRequestFormValues = z.infer<typeof FundRequestSchema>;

export const FundRequestActivitySchema = z.object({
    activities: z.array(
        z.object({
            activity_description: z.string().min(1, "Field Required"),
            quantity: z.string().min(1, "Field Required"),
            unit_cost: z.string().min(1, "Field Required"),
            frequency: z.string().min(1, "Field Required"),
            comment: z.string().min(1, "Field Required"),
            category: z.string().min(1, "Field Required"),
        })
    ),
});

export type TFundRequestActivityFormValues = z.infer<
    typeof FundRequestActivitySchema
>;

export interface TFundRequestActivity {
    id: string;
    category: CostCategory;
    amount: string;
    created_datetime: string;
    updated_datetime: string;
    activity_description: string;
    unit_cost: string;
    quantity: number;
    frequency: 2;
    comment: string;
    fund_request: string;
}
