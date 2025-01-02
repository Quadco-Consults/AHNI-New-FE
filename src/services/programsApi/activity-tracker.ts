import {
    TWorkPlanTrackerData,
    TWorkPlanTrackerFormValues,
} from "definations/program-types/activity-tracker";
import baseAPI from "..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const ActivityTrackerAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createActivityTracker: builder.mutation<
            TResponse<TWorkPlanTrackerData>,
            TWorkPlanTrackerFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/plans/activity-trackers/",
                body,
            }),
        }),

        getAllActivityTracker: builder.query<
            TPaginatedResponse<TWorkPlanTrackerData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/programs/plans/works/trackers/",
                params,
            }),
            providesTags: ["ACTIVITY_TRACKER"],
        }),

        getSingleActivityTracker: builder.query<
            TResponse<TWorkPlanTrackerData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/plans/works/trackers/${id}/`,
            }),
        }),

        updateActivityTracker: builder.mutation<
            TResponse<TWorkPlanTrackerData>,
            { id: string; body: TWorkPlanTrackerFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/plans/works/trackers/${id}/`,
                body,
            }),
            invalidatesTags: ["ACTIVITY_TRACKER"],
        }),

        patchWorkPlanTracker: builder.mutation<
            TResponse<TWorkPlanTrackerData>,
            { id: string; body: { status: string } }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/plans/works/trackers/${id}/`,
                body,
            }),
            invalidatesTags: ["ACTIVITY_TRACKER"],
        }),

        deleteActivityTracker: builder.mutation<
            TResponse<TWorkPlanTrackerData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/plans/works/trackers/${id}/`,
            }),
            invalidatesTags: ["ACTIVITY_TRACKER"],
        }),
    }),
});

export const {
    useCreateActivityTrackerMutation,
    useGetAllActivityTrackerQuery,
    useGetSingleActivityTrackerQuery,
    useUpdateActivityTrackerMutation,
    usePatchWorkPlanTrackerMutation,
    useDeleteActivityTrackerMutation,
} = ActivityTrackerAPI;
