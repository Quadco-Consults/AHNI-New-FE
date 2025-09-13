import { TBasePaginatedResponse } from "features/auth/types/auth";
import { CostCategory } from "definations/module-finance";
import { TFundRequestActivity } from "features/programs/types/program-validator";

export interface FundRequestPaginatedData {
    id: string;
    activities: [];
    project: string;
    financial_year: string;
    location: string;
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
}

export type TFundRequestPaginatedResponse =
    TBasePaginatedResponse<FundRequestPaginatedData>;

export interface TFundRequestResponseData {
    id: string;
    activities: TFundRequestActivity[];
    uuid_code: string;
    available_balance: string;
    project: {
        id: string;
        project_managers: [
            {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
            }
        ];
        beneficiaries: [
            {
                id: "52f56f12-0159-46a7-983e-1dc0e140ff40";
                created_datetime: "2024-11-22T22:01:32.949632Z";
                updated_datetime: "2024-11-22T22:01:32.949650Z";
                name: "AUN";
                description: "AUN";
            },
            {
                id: "9a07ce4f-0ff5-47a0-8e74-689ce4d6efda";
                created_datetime: "2024-11-22T22:01:46.145605Z";
                updated_datetime: "2024-11-22T22:01:46.145623Z";
                name: "FYTN";
                description: "FYTN";
            }
        ];
        funding_sources: [
            {
                id: "49e29da0-4764-47ca-9695-ad068803e362";
                created_datetime: "2024-11-22T22:00:59.253579Z";
                updated_datetime: "2024-11-22T22:00:59.253597Z";
                name: "FHI 360";
                description: "FHI 360";
            }
        ];
        objectives: [
            {
                objective: "JJD";
                sub_objectives: ["DKDK", "JDJ"];
            },
            {
                objective: "Another objective";
                sub_objectives: ["Sub objective"];
            }
        ];
        partners: [
            {
                id: "6b155fdb-4b7e-4c80-9579-174ab965f56c";
                created_datetime: "2024-11-22T22:02:50.144186Z";
                updated_datetime: "2024-11-22T22:02:50.144200Z";
                name: "AUN";
                address: "YOLA";
                city: "YOLA";
                state: "Adamawa";
                email: "abc@mail.com";
                phone: "0998877";
                website: "www.jjj.com";
            },
            {
                id: "1948e8b7-12b3-44ee-a720-b92ff2ac5b39";
                created_datetime: "2024-11-22T10:35:17.195349Z";
                updated_datetime: "2024-11-22T10:35:17.195366Z";
                name: "Test Partner";
                address: "30 Araromi Street";
                city: "Lagos";
                state: "Lagos";
                email: "ubakawilson@gmail.com";
                phone: "08104478624";
                website: "google.com";
            }
        ];
        created_datetime: "2024-11-29T10:51:55.368245Z";
        updated_datetime: "2024-12-03T16:03:51.811685Z";
        project_id: string;
        title: string;
        goal: "JFJFJ";
        narrative: "JDJJ";
        expected_results: "DKDK";
        achievement_against_target: "3939";
        budget_performance: "3949";
        start_date: "2024-11-29";
        end_date: "2024-11-30";
        budget: 3030.0;
        status: "CLOSED";
    };
    financial_year: {
        id: "e4a47b5b-99a1-418c-b5a5-d609e2139f4c";
        created_datetime: "2024-12-03T20:31:05.792302Z";
        updated_datetime: "2024-12-03T20:31:05.792316Z";
        year: string;
        dyanmic_order: "123";
        current: "true";
    };
    location: {
        id: "41e9da39-2bd5-4106-a8de-cc65309d941b";
        created_datetime: "2024-11-20T02:18:03.377433Z";
        updated_datetime: "2024-11-20T02:18:03.377448Z";
        name: "fffo";
        address: "03030kdk";
        city: "kkk";
        state: "Abia";
        email: "jfjfjfj@kd.com";
        phone: "0404040";
        unique_code?: string;
    };
    created_datetime: "2024-12-04T06:30:35.603259Z";
    updated_datetime: "2024-12-04T06:30:35.603276Z";
    year: string;
    month: string;
    currency: "USD";
    type: "MAIN";
    status: "PENDING" | "REVIEWED" | "LOCATION_REVIEWED" | "LOCATION_AUTHORIZED" | "STATE_REVIEWED" | "STATE_AUTHORIZED" | "HQ_REVIEWED" | "HQ_AUTHORIZED" | "HQ_APPROVED" | "REJECTED";
    created_by: string;
    updated_by: string | null;
    reviewer: string | null;
    location_reviewer: string | null;
    location_authorizer: string | null;
    state_reviewer: string | null;
    state_authorizer: string | null;
    hq_reviewer: string | null;
    hq_authorizer: string | null;
    hq_approver: string | null;
}
