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

        getAllSupervisionPlanReviews: builder.query<
            TPaginatedResponse<TSupervisionPlanPaginatedData>,
            TRequest & { planId: string }
        >({
            query: ({ planId, ...rest }) => ({
                method: "GET",
                url: `${BASE_URL}${planId}/reviews/`,
                params: rest,
            }),
            providesTags: ["SUPERVISION_PLAN_REVIEW"],
        }),

        getSingleSupervisionPlanReview: builder.query<
            TResponse<TSupervisionPlanSingleData>,
            { planId: string; reviewId: string }
        >({
            query: ({ planId, reviewId }) => ({
                method: "GET",
                url: `${BASE_URL}${planId}/reviews/${reviewId}/`,
            }),
            providesTags: ["SUPERVISION_PLAN_REVIEW"],
        }),

        // https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/programs/plans/supportive-supervision/{id}/reviews/{review_pk}/

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

export const {
    useCreateSupervisionPlanReviewMutation,
    useGetAllSupervisionPlanReviewsQuery,
    useGetSingleSupervisionPlanReviewQuery,
} = SupervisionPlanReviewAPI;
