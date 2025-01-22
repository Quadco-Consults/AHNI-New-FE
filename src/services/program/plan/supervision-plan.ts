import baseAPI from "../..";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TSupervisionPlanPaginatedData,
    TSSPCompositionFormValues,
    TSupervisionPlanSingleData,
} from "definations/program/plan/supervision-plan";

const BASE_URL = "/programs/plans/supportive-supervision/";

const SupervisionPlanAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSupervisionPlan: builder.mutation<
            TResponse<TSupervisionPlanPaginatedData>,
            TSSPCompositionFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["SUPERVISION_PLAN"],
        }),

        getAllSupervisionPlan: builder.query<
            TPaginatedResponse<TSupervisionPlanPaginatedData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: BASE_URL,
                params,
            }),
            providesTags: ["SUPERVISION_PLAN"],
        }),

        getSingleSupervisionPlan: builder.query<
            TResponse<TSupervisionPlanSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
            providesTags: ["SUPERVISION_PLAN"],
        }),

        modifySupervisionPlan: builder.mutation<
            TResponse<TSupervisionPlanSingleData>,
            { id: string; body: TSSPCompositionFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `${BASE_URL}${id}/`,
                body,
            }),
            invalidatesTags: ["SUPERVISION_PLAN"],
        }),

        deleteSupervisionPlan: builder.mutation<
            TResponse<TSupervisionPlanSingleData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}`,
            }),
            invalidatesTags: ["SUPERVISION_PLAN"],
        }),
    }),
});

export const {
    useCreateSupervisionPlanMutation,
    useGetAllSupervisionPlanQuery,
    useGetSingleSupervisionPlanQuery,
    useModifySupervisionPlanMutation,
    useDeleteSupervisionPlanMutation,
} = SupervisionPlanAPI;
