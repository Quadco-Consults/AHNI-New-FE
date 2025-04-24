import baseAPI from "../../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TSupervisionPlanPaginatedData,
    TSSPCompositionFormValues,
    TSupervisionPlanSingleData,
} from "definations/program/plan/supervision-plan/supervision-plan";
import {
    ISupervisionPlanReviewSingleData,
    TSupervisionPlanReviewFormData,
} from "definations/program/plan/supervision-plan/supervision-plan-review";

const BASE_URL = "/programs/plans/supportive-supervision/";

const SupervisionPlanReviewAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSupervisionPlanReview: builder.mutation<
            TResponse<ISupervisionPlanReviewSingleData>,
            { id: string; body: TSupervisionPlanReviewFormData }
        >({
            query: ({ id, body }) => ({
                method: "POST",
                url: `${BASE_URL}${id}/reviews/`,
                body,
            }),
            invalidatesTags: ["SUPERVISION_PLAN_REVIEW"],
        }),
        // getAllSupervisionPlan: builder.query<
        //     TPaginatedResponse<TSupervisionPlanPaginatedData>,
        //     TRequest
        // >({
        //     query: (params) => ({
        //         method: "GET",
        //         url: BASE_URL,
        //         params,
        //     }),
        //     providesTags: ["SUPERVISION_PLAN"],
        // }),
        // getSingleSupervisionPlan: builder.query<
        //     TResponse<TSupervisionPlanSingleData>,
        //     string
        // >({
        //     query: (id) => ({
        //         method: "GET",
        //         url: `${BASE_URL}${id}`,
        //     }),
        //     providesTags: ["SUPERVISION_PLAN"],
        // }),
        // modifySupervisionPlan: builder.mutation<
        //     TResponse<TSupervisionPlanSingleData>,
        //     { id: string; body: TSSPCompositionFormValues }
        // >({
        //     query: ({ id, body }) => ({
        //         method: "PUT",
        //         url: `${BASE_URL}${id}/`,
        //         body,
        //     }),
        //     invalidatesTags: ["SUPERVISION_PLAN"],
        // }),
        // deleteSupervisionPlan: builder.mutation<
        //     TResponse<TSupervisionPlanSingleData>,
        //     string
        // >({
        //     query: (id) => ({
        //         method: "DELETE",
        //         url: `${BASE_URL}${id}`,
        //     }),
        //     invalidatesTags: ["SUPERVISION_PLAN"],
        // }),
    }),
});

export const { useCreateSupervisionPlanReviewMutation } =
    SupervisionPlanReviewAPI;
