import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import baseAPI from "..";
import {
    TActivityTrackerFormValues,
    TActivityTrackerResult,
} from "definations/program-types/activity-tracker";

const ActivityTrackerAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createActivityTracker: builder.mutation<
            null,
            TActivityTrackerFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/programs/plans/activity-trackers/",
                body,
            }),
        }),

        getAllActivityTracker: builder.query<
            TBasePaginatedResponse<TActivityTrackerResult>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: "/programs/plans/works/trackers/",
            }),
            providesTags: ["ACTIVITY_TRACKER"],
        }),

        getSingleActivityTracker: builder.query<
            TResponse<TActivityTrackerResult>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/plans/works/trackers/${id}/`,
            }),
        }),

        updateActivityTracker: builder.mutation<
            TResponse<TActivityTrackerResult>,
            { id: string; body: TActivityTrackerFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/programs/plans/works/trackers/${id}/`,
                body,
            }),
            invalidatesTags: ["ACTIVITY_TRACKER"],
        }),

        deleteActivityTracker: builder.mutation<
            TResponse<TActivityTrackerResult>,
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
    useDeleteActivityTrackerMutation,
} = ActivityTrackerAPI;
