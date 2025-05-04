import baseAPI from "../../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    ISupervisionPlanReviewPaginatedData,
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
            TPaginatedResponse<ISupervisionPlanReviewPaginatedData>,
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
            TResponse<ISupervisionPlanReviewSingleData>,
            { planId: string; reviewId: string }
        >({
            query: ({ planId, reviewId }) => ({
                method: "GET",
                url: `${BASE_URL}${planId}/reviews/${reviewId}/`,
            }),
            providesTags: ["SUPERVISION_PLAN_REVIEW"],
        }),

        modifySupervisionPlanReview: builder.mutation<
            TResponse<ISupervisionPlanReviewSingleData>,
            {
                planId: string;
                reviewId: string;
                body: TSupervisionPlanReviewFormData;
            }
        >({
            query: ({ planId, reviewId, body }) => ({
                method: "PATCH",
                url: `${BASE_URL}${planId}/reviews/${reviewId}/`,
                body,
            }),
            invalidatesTags: ["SUPERVISION_PLAN_REVIEW"],
        }),

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
    useModifySupervisionPlanReviewMutation,
} = SupervisionPlanReviewAPI;
