import { Partners } from "definations/module-projects";

export interface ProjectsResultsData {
    id: string;
    created_datetime: "string";
    updated_datetime: string;
    project_id: string;
    title: string;
    goal: string;
    currency: string;
    expected_results: string;
    start_date: string;
    end_date: string;
    budget: number;
    status: string;
    narrative: string;
    budget_performance: string;
    project_managers: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    }[];
    beneficiaries: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        name: string;
        description: string;
    }[];
    funding_sources: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        name: string;
        description: string;
    }[];
    achievement_against_target: string;
    partners: Partners[];
    objectives: {
        objective: string;
        sub_objectives: string[];
    }[];
}

export interface ProjectsData {
    count: number;
    next: string;
    number_of_pages: number;
    previous: string;
    results: ProjectsResultsData[];
}

export interface ProjectsResponse {
    status: string;
    message: string;
    data: ProjectsResultsData;
}
