import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import baseAPI from "..";
import {
    TEngagementPlanFormValue,
    TEngagementPlanResponse,
} from "definations/program-types/engagement-plan";

// https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/programs/stakeholders/engagement-plans/
const EngagementPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanResponse>,
            TEngagementPlanFormValue
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/stakeholders/engagement-plans/",
                body,
            }),
        }),

        getAllEngagementPlans: builder.query<
            TBasePaginatedResponse<TEngagementPlanResponse>,
            {}
        >({
            query: () => ({
                method: "GET",
                url: "/programs/stakeholders/engagement-plans/",
            }),
        }),

        getSingleEngagementPlan: builder.query<
            TResponse<TEngagementPlanResponse>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
            }),
        }),

        updateEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanResponse>,
            { id: string; body: TEngagementPlanFormValue }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/stakeholders/engagement-plans/${id}/`,
                body,
            }),
        }),

        deleteEngagementPlan: builder.mutation<
            TResponse<TEngagementPlanResponse>,
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
