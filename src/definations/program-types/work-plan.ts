export interface TWorkPlanPaginatedResponse {
    id: string;
    project: string;
    project_partners: [];
    created_datetime: string;
    updated_datetime: string;
    financial_year: -2147483648;
    activity_number: string;
    activities: string;
    activity_justification: string;
    lead_dept: string;
    lead_person: string;
    gant_chart: null;
    expected_result: string;
    indicators: string;
    mov: string;
    budget_unit_cost_ngn: number;
    location: string;
    approved_ref_no: string;
    comments: string;
    created_by: string;
    updated_by: string;
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
    expected_result: string;
    indicator: string;
    mov: string;
    unit_cost_ngn: null;
    location: string;
    approved_ref_no: null;
    comments: string;
    work_plan: string;
}
