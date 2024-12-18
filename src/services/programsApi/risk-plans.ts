import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import {
    TRiskManagementPlanData,
    TRiskPlanManagementFormValues,
} from "definations/program-validator";

const RiskPlanManagementAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createRiskManagementPlan: builder.mutation<
            TResponse<TRiskManagementPlanData>,
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
            TPaginatedResponse<TRiskManagementPlanData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/programs/plans/risk-management/",
                params,
            }),
            providesTags: ["RISK_PLAN"],
        }),

        getSingleRiskPlanManagement: builder.query<
            TResponse<TRiskManagementPlanData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/plans/risk-management/${id}`,
            }),
        }),

        updateRiskManagementPlan: builder.mutation<
            TResponse<TRiskManagementPlanData>,
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
            TResponse<TRiskManagementPlanData>,
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
            TResponse<TRiskManagementPlanData>,
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
