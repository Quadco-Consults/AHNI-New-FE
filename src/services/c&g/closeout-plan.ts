import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "..";
import {
    ICloseOutPlanPaginatedData,
    ICloseOutPlanSingleData,
    TCloseOutPlanFormData,
} from "definations/c&g/closeout-plan";

const BASE_URL = "/contract-grants/closeout/plans/";

const CloseOutPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createCloseOutPlan: builder.mutation<
            TResponse<ICloseOutPlanSingleData>,
            TCloseOutPlanFormData
        >({
            query: (body) => ({
                method: "POST",
                url: `${BASE_URL}`,
                body,
            }),
            invalidatesTags: ["CLOSE_OUT_PLAN"],
        }),

        getAllCloseOutPlans: builder.query<
            TPaginatedResponse<ICloseOutPlanPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: `${BASE_URL}`,
                params,
            }),
            providesTags: ["CLOSE_OUT_PLAN"],
        }),

        getSingleCloseOutPlan: builder.query<
            TResponse<ICloseOutPlanSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["CLOSE_OUT_PLAN"],
        }),

        modifyCloseOutPlan: builder.mutation<
            TResponse<ICloseOutPlanSingleData>,
            { id: string; body: TCloseOutPlanFormData }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["CLOSE_OUT_PLAN"],
        }),

        deleteCloseOutPlan: builder.mutation<
            TResponse<ICloseOutPlanSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["SUB_GRANT"],
        }),
    }),
});

export const {
    useCreateCloseOutPlanMutation,
    useGetAllCloseOutPlansQuery,
    useGetSingleCloseOutPlanQuery,
    useModifyCloseOutPlanMutation,
    useDeleteCloseOutPlanMutation,
} = CloseOutPlanAPI;
