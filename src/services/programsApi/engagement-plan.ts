import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import baseAPI from "..";
import {
    TEngagementPlanFormValue,
    TEngagementPlanPaginatedResponse,
    TEngagementPlanSingleResponse,
} from "definations/program-types/engagement-plan";

const EngagementPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanSingleResponse>,
            TEngagementPlanFormValue
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/stakeholders/engagement-plans/",
                body,
            }),
        }),

        getAllEngagementPlans: builder.query<
            TBasePaginatedResponse<TEngagementPlanPaginatedResponse>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: "/programs/stakeholders/engagement-plans/",
            }),
        }),

        getSingleEngagementPlan: builder.query<
            TResponse<TEngagementPlanSingleResponse>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
            }),
        }),

        updateEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanSingleResponse>,
            { id: string; body: TEngagementPlanFormValue }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
                body,
            }),
        }),

        deleteEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanSingleResponse>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
            }),
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
