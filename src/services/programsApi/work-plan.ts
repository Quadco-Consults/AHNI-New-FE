import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import baseAPI from "..";
import {
    TWorkPlanPaginatedResponse,
    TWorkPlanSingleResponse,
} from "definations/program-types/work-plan";

const WorkPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        uploadWorkPlan: builder.mutation<null, { project: string; file: File }>(
            {
                query: (body) => ({
                    method: "POST",
                    url: "/programs/plans/works/sheet/upload/",
                    body,
                }),
                invalidatesTags: ["WORK_PLAN"],
            }
        ),

        getAllWorkPlan: builder.query<
            TBasePaginatedResponse<TWorkPlanPaginatedResponse>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: "/programs/plans/works/",
            }),
            providesTags: ["WORK_PLAN"],
        }),

        getSingleWorkPlan: builder.query<
            TResponse<TWorkPlanSingleResponse>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/programs/plans/works/${id}`,
            }),
        }),

        deleteWorkPlan: builder.mutation<
            TResponse<TWorkPlanSingleResponse>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/programs/plans/works/${id}`,
            }),
            invalidatesTags: ["WORK_PLAN"],
        }),
    }),
});

export const {
    useUploadWorkPlanMutation,
    useGetAllWorkPlanQuery,
    useGetSingleWorkPlanQuery,
    useDeleteWorkPlanMutation,
} = WorkPlanAPI;
