import baseAPI from "..";
import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import {
    TRiskPlanManagementFormValues,
    TRiskPlanPlanManagementResponse,
} from "definations/program-validator";

const RiskPlanManagementAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createRiskManagementPlan: builder.mutation<
            TResponse<TRiskPlanPlanManagementResponse>,
            TRiskPlanManagementFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/plans/risk-management/",
                body,
            }),
            invalidatesTags: ["RISK_PLAN"],
        }),

        getAllRiskManagementPlans: builder.query<
            TBasePaginatedResponse<TRiskPlanPlanManagementResponse>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: "/programs/plans/risk-management/",
            }),
            providesTags: ["RISK_PLAN"],
        }),

        getSingleRiskPlanManagement: builder.query<
            TResponse<TRiskPlanPlanManagementResponse>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/plans/risk-management/${id}`,
            }),
        }),

        updateRiskManagementPlan: builder.mutation<
            TResponse<TRiskPlanPlanManagementResponse>,
            { id: string; body: TRiskPlanManagementFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/plans/risk-management/${id}/`,
                body,
            }),
            invalidatesTags: ["RISK_PLAN"],
        }),

        patchRiskManagementPlan: builder.mutation<
            TResponse<TRiskPlanPlanManagementResponse>,
            { id: string; body: { risk_status: string } }
        >({
            query: ({ id, body }) => ({
                method: "PATCH",
                url: `/programs/plans/risk-management/${id}/`,
                body,
            }),
            invalidatesTags: ["RISK_PLAN"],
        }),

        deleteRiskManagementPlan: builder.mutation<
            TResponse<TRiskPlanPlanManagementResponse>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/plans/risk-management/${id}`,
            }),
            invalidatesTags: ["RISK_PLAN"],
        }),
    }),
});

export const {
    useCreateRiskManagementPlanMutation,
    useGetAllRiskManagementPlansQuery,
    useGetSingleRiskPlanManagementQuery,
    useUpdateRiskManagementPlanMutation,
    usePatchRiskManagementPlanMutation,
    useDeleteRiskManagementPlanMutation,
} = RiskPlanManagementAPI;
