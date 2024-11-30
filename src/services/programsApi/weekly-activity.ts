/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";
import { z } from "zod";
import { WeeklyActivitySchema } from "definations/program-validator";
import {
    WeeklyActivityData,
    WeeklyActivityResponse,
    WeeklyActivityResultsData,
} from "definations/program-types/activity-plan";

const BASE_URL = "/programs/weekly-activity/";

const WeeklyActivityAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getWeeklyActivities: builder.query<WeeklyActivityData, {}>({
            query: (config) => {
                return {
                    url: `${BASE_URL}`,
                    ...config,
                };
            },
            providesTags: (data, error) =>
                !error ? provideTags("WEEKLY_ACTIVITY", data) : [],
        }),

        createWeeklyActivity: builder.mutation<
            WeeklyActivityResponse,
            z.infer<typeof WeeklyActivitySchema>
        >({
            query: (body) => ({
                url: `${BASE_URL}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_, error, {}) =>
                !error ? invalidateTags("WEEKLY_ACTIVITY") : [],
        }),

        uploadWeeklyActivity: builder.mutation<
            WeeklyActivityResponse,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}upload/${path.id}/`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_, error, {}) =>
                !error ? invalidateTags("WEEKLY_ACTIVITY") : [],
        }),

        getWeeklyActivity: builder.query<
            WeeklyActivityResultsData,
            { path: { id: string } }
        >({
            query: ({ path }) => {
                return {
                    url: `${BASE_URL}${path.id}/`,
                };
            },
            providesTags: (data, error) =>
                !error ? provideTags("WEEKLY_ACTIVITY", data) : [],
        }),

        updateWeeklyActivity: builder.mutation<
            WeeklyActivityResponse,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_, error, { path }) =>
                !error
                    ? invalidateTags("WEEKLY_ACTIVITY", { ids: [path.id] })
                    : [],
        }),

        modifyWeeklyActivity: builder.mutation<
            WeeklyActivityResponse,
            { path: { id: string }; body: any }
        >({
            query: ({ path, body }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_, error, { path }) =>
                !error
                    ? invalidateTags("WEEKLY_ACTIVITY", { ids: [path.id] })
                    : [],
        }),

        deleteWeeklyActivity: builder.mutation<void, { path: { id: string } }>({
            query: ({ path }) => ({
                url: `${BASE_URL}${path.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: (_, error, { path }) =>
                !error
                    ? invalidateTags("WEEKLY_ACTIVITY", { ids: [path.id] })
                    : [],
        }),
    }),
});

export default WeeklyActivityAPI;
