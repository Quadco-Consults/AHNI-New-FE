import { TFinancialYearData } from "definations/modules/config/financial-year";

export interface TWorkPlanPaginatedResponse {
    id: string;
    project: string;
    project_partners: string[];
    financial_year: string;
    budget: number;
    created_datetime: string;
    updated_datetime: string;
    created_by: string;
    updated_by: null;
}

export interface TWorkPlanSingleResponse {
    id: string;
    project: {
        title: string;
        budget: number;
        objectives: {
            objective: string;
            sub_objectives: string[];
        }[];

        partners: {
            id: string;
            created_datetime: string;
            updated_datetime: string;
            name: string;
            address: string;
            city: string;
            state: string;
            email: string;
            phone: string;
            website: string;
        }[];
    };
    activities: TActivity[];
    budget_unit_cost_ngn: string;
    financial_year: TFinancialYearData;
}

export interface TActivity {
    id: string;
    activity_number: string;
    activity: string;
    activity_justification: string;
    lead_dept: string;
    lead_person: string;
    gant_chart: {
        Apr: number;
        Aug: number;
        Dec: number;
        Feb: number;
        Jan: number;
        Jul: number;
        Jun: number;
        Mar: number;
        May: number;
        Nov: number;
        Oct: number;
        Sep: number;
    };
    total_amount_ngn: string;
    total_amount_usd: string;
    expected_result: string;
    indicator: string;
    mov: string;
    unit_cost_ngn: null;
    location: string;
    approved_ref_no: null;
    comments: string;
    work_plan: string;
}
