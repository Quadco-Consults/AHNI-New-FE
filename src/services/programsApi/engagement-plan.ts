import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import {
    TEngagementPlanFormValues,
    TEngagementPlanPaginatedData,
    TEngagementPlanSingleData,
} from "definations/program-types/engagement-plan";

const EngagementPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanSingleData>,
            TEngagementPlanFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/stakeholders/engagement-plans/",
                body,
            }),
            invalidatesTags: ["ENGAGEMENT_PLAN"],
        }),

        getAllEngagementPlans: builder.query<
            TPaginatedResponse<TEngagementPlanPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/programs/stakeholders/engagement-plans/",
                params,
            }),
            providesTags: ["ENGAGEMENT_PLAN"],
        }),

        getSingleEngagementPlan: builder.query<
            TResponse<TEngagementPlanSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
            }),
        }),

        updateEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanSingleData>,
            { id: string; body: TEngagementPlanFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
                body,
            }),
            invalidatesTags: ["ENGAGEMENT_PLAN"],
        }),

        deleteEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
            }),
            invalidatesTags: ["ENGAGEMENT_PLAN"],
        }),
    }),
});

export const {
    useCreateEngagementPlanMutation,
    useGetAllEngagementPlansQuery,
    useGetSingleEngagementPlanQuery,
    useUpdateEngagementPlanMutation,
    useDeleteEngagementPlanMutation,
} = EngagementPlanAPI;
