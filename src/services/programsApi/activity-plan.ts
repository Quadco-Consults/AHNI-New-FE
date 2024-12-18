import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import {
    TActivityPlanData,
    TActivityPlanFormValues,
} from "definations/program-types/activity-plan";

const ActivityPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createActivityPlan: builder.mutation<
            TActivityPlanData,
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
            TPaginatedResponse<TActivityPlanData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/programs/plans/activity/",
                params,
            }),
            providesTags: ["ACTIVITY_PLAN"],
        }),

        getSingleActivityPlan: builder.query<
            TResponse<TActivityPlanData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/plans/activity/${id}`,
            }),
        }),

        editActivityPlan: builder.mutation<
            TResponse<TActivityPlanData>,
            { id: string; body: TActivityPlanFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/plans/activity/${id}/`,
                body,
            }),
        }),

        deleteActivityPlan: builder.mutation<
            TResponse<TActivityPlanData>,
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
