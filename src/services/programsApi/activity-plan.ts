import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import baseAPI from "..";
import {
    TActivityPlanFormValues,
    TActivityPlanResponse,
} from "definations/program-types/activity-plan";

const ActivityPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createActivityPlan: builder.mutation<
            TActivityPlanResponse,
            TActivityPlanFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/plans/activity/",
                body,
            }),
            invalidatesTags: ["ACTIVITY_PLAN"],
        }),

        downloadActivityPlanTemplate: builder.query({
            query: () => ({
                method: "GET",
                url: "/programs/plans/activity/sheet/template/",
                responseHandler: (response) => response.blob(),
            }),
        }),

        uploadActivityPlan: builder.mutation<
            null,
            { project: string; file: File }
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/plans/activity/sheet/upload/",
                body,
            }),
            invalidatesTags: ["ACTIVITY_PLAN"],
        }),

        getAllActivityPlans: builder.query<
            TBasePaginatedResponse<TActivityPlanResponse>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: "/programs/plans/activity/",
            }),
            providesTags: ["ACTIVITY_PLAN"],
        }),

        getSingleActivityPlan: builder.query<
            TResponse<TActivityPlanResponse>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/plans/activity/${id}`,
            }),
        }),

        editActivityPlan: builder.mutation<
            TResponse<TActivityPlanResponse>,
            { id: string; body: TActivityPlanFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/plans/activity/${id}/`,
                body,
            }),
        }),

        deleteActivityPlan: builder.mutation<
            TResponse<TActivityPlanResponse>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/plans/activity/${id}`,
            }),
            invalidatesTags: ["ACTIVITY_PLAN"],
        }),
    }),
});

export const {
    useCreateActivityPlanMutation,
    useDownloadActivityPlanTemplateQuery,
    useLazyDownloadActivityPlanTemplateQuery,
    useUploadActivityPlanMutation,
    useGetAllActivityPlansQuery,
    useGetSingleActivityPlanQuery,
    useEditActivityPlanMutation,
    useDeleteActivityPlanMutation,
} = ActivityPlanAPI;
