import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import {
    TWorkPlanPaginatedResponse,
    TWorkPlanSingleResponse,
} from "definations/program-types/work-plan";

const WorkPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        downloadWorkPlanTemplate: builder.query({
            query: () => ({
                method: "GET",
                url: "/programs/plans/works/sheet/template/",
                responseHandler: (response) => response.blob(),
            }),
        }),

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
            TPaginatedResponse<TWorkPlanPaginatedResponse>,
            TRequest & { project_title?: string }
        >({
            query: (params) => ({
                method: "GET",
                url: "/programs/plans/works/",
                params,
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
    useLazyDownloadWorkPlanTemplateQuery,
    useUploadWorkPlanMutation,
    useGetAllWorkPlanQuery,
    useGetSingleWorkPlanQuery,
    useDeleteWorkPlanMutation,
} = WorkPlanAPI;
