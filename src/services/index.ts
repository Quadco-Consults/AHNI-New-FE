import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    createApi,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "src/store";

//
// https://ahniprod-eec741554a5e.herokuapp.com/api/v1/

const baseQuery = fetchBaseQuery({
    // baseUrl: "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/",
    baseUrl: "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/",
    prepareHeaders: (headers, { getState }) => {
        // @ts-ignore
        const { auth } = getState() as RootState;

        if (auth.access_token) {
            headers.set("Authorization", `Bearer ${auth.access_token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 404) {
        return result.error;
    }
    return result;
};

const baseAPI = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    //  cache , The default time is seconds , Default duration 60 second

    tagTypes: [
        "Users",
        "Roles",
        "Permission",
        "FundingSource",
        "Beneficiaries",
        "DocumentTypes",
        "Partners",
        "Facilities",
        "SupervisionCategory",
        "RiskCategory",
        "InterventionArea",
        "Stock",
        "FUND_REQUEST",
        "PURCHASE_REQUEST",
        "SAMPLE_MEMO",
        "ITEMS",
        "PURCHASE_ORDER",
        "SOLICITATION",
        "SOLICITATION_CRITERIA",
        "CBA",
        "PRICE_INTELLIGENCE",
        "Agreement",
        "Facility",
        "FuelRecord",
        "PROCUREMENT_PLAN",
        "PROCUREMENT_TRACKER",
        "PAYMENT",
        "AM",
        "AssetsRequest",
        "AssetConditions",
        "AssetTypes",
        "Categories",
        "Departments",
        "FinancialYear",
        "Items",
        "Locations",
        "Lots",
        "Solicitation",
        "PrequalificationCategory",
        "PrequalificationCriteria",
        "Questionairs",
        "WORKFORCE",
        "HR_GRADE",
        "JOB_ADVERTISEMENTS",
        "JOB_APPLICATIONS",
        "EMPLOYEE_ONBOARDING",
        "GRIEVIANCE_MANAGEMENT",
        "LEAVE_PACKAGE",
        "LEAVE_REQUEST",
        "INTERVIEWS",
        "HR_POSITION",
        "HR_BENEFICIARIES",
        "Cost_Category",
        "Cost_Input",
        "BudgetLine",
        "FCONumber",
        "ProjectClass",
        "ChartAccount",
        "SupervisionCriteria",
        "STAKEHOLDER_REGISTER",
        "RISK_PLAN",
        "ACTIVITY_PLAN",
        "WORK_PLAN",
        "Position",
        "ACTIVITY_TRACKER",
        "ENGAGEMENT_PLAN",
        "PROJECTS",
        "ASSET_CLASSIFICATION",
        "Consumable",
        "PROJECT_DOCUMENT",
        "ITEM_REQUISITION",
        "ASSET",
        "ASSET_REQUEST",
        "GOOD_RECEIVE_NOTE",
        "SUPERVISION_PLAN",
        "VEHICLE_MAINTENANCE",
        "FUEL_REQUEST",
        "VEHICLE_REQUEST",
        "FACILITY_MAINTENANCE",
        "PAYMENT_REQUEST",
        "ASSET_MAINTENANCE",
        "EXPENSE_AUTHORIZATION",
        "TRAVEL_EXPENSE",
        "VENDOR_EVALUATION",
        "GRANT",
        "EXPENDITURE",
        "OBLIGATION",
        "SUB_GRANT",
        "MANUAL_BID_CBA_PREQUALIFICATION",
        "MARKETPRICE",
        "SUBGRANT_SUBMISSION",
        "MANUAL_BID_CBA_PREQUALIFICATION",
        "SUBGRANT_UPLOAD",
        "PRE_AWARD_QUESTION",
        "AGREEMENT",
        "CONSULTANT_MANAGEMENT",
        "CONSULTANCY_REPORT",
        "FACILITATOR_MANAGEMENT",
        "CLOSE_OUT_PLAN",
        "CONSULTANCY_APPLICATION",
    ],
    // keepUnusedDataFor: 5 * 60,
    keepUnusedDataFor: 0,
    refetchOnMountOrArgChange: true,
});

export default baseAPI;
