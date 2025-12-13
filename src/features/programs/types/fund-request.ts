import { TBasePaginatedResponse } from "features/auth/types/auth";
import { CostCategory } from "definations/module-finance";
import { TFundRequestActivity } from "features/programs/types/program-validator";
import {
  TFundRequestBackendResponse,
  TFundRequestActivityBackendResponse,
  FundRequestStatus,
} from "definations/program-validator";

export interface FundRequestPaginatedData {
    id: string;
    activities: [];
    project: string | {
        id?: string;
        project_id?: string;
        title?: string;
        start_date?: string;
        end_date?: string;
        [key: string]: any;
    };
    financial_year: string;
    location: string | { name: string; state?: string; [key: string]: any };
    location_name?: string;
    location_code?: string;
    location_display?: string;
    created_datetime: string;
    updated_datetime: string;
    year: string;
    month: string;
    currency: string;
    total_amount: string;
    type: string;
    status: string;
    created_by: string;
    updated_by: string;
    reviewer: string;
    available_balance: string;
    uuid_code?: string;
}

export type TFundRequestPaginatedResponse =
    TBasePaginatedResponse<FundRequestPaginatedData>;

// Use the backend response type for consistency
export type TFundRequestResponseData = TFundRequestBackendResponse;

// Legacy interface for backward compatibility (deprecated - use TFundRequestBackendResponse)
export interface TFundRequestResponseDataLegacy {
    id: string;
    activities: TFundRequestActivity[];
    uuid_code: string;
    available_balance: string;
    project: {
        id: string;
        project_managers: Array<{
            id: string;
            email: string;
            first_name: string;
            last_name: string;
        }>;
        beneficiaries: Array<{
            id: string;
            created_datetime: string;
            updated_datetime: string;
            name: string;
            description: string;
        }>;
        funding_sources: Array<{
            id: string;
            created_datetime: string;
            updated_datetime: string;
            name: string;
            description: string;
        }>;
        objectives: Array<{
            objective: string;
            sub_objectives: string[];
        }>;
        partners: Array<{
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
        }>;
        created_datetime: string;
        updated_datetime: string;
        project_id: string;
        title: string;
        goal: string;
        narrative: string;
        expected_results: string;
        achievement_against_target: string;
        budget_performance: string;
        start_date: string;
        end_date: string;
        budget: number;
        status: string;
    };
    financial_year: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        year: string;
        dyanmic_order: string;
        current: string;
    };
    location: {
        id: string;
        created_datetime: string;
        updated_datetime: string;
        name: string;
        address: string;
        city: string;
        state: string;
        email: string;
        phone: string;
        unique_code?: string;
    };
    created_datetime: string;
    updated_datetime: string;
    year: string;
    month: string;
    currency: "USD" | "NGN";
    type: "MAIN" | "SUPPLEMENTARY";
    status: FundRequestStatus;
    total_amount: string | number;
    created_by: string;
    updated_by: string | null;
    reviewer: string | null;
    location_reviewer: string | null;
    location_authorizer: string | null;
    // Removed state_reviewer and state_authorizer - not in backend model
    hq_reviewer: string | null;
    hq_authorizer: string | null;
    hq_approver: string | null;
}
