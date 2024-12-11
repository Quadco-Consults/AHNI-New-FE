import { TBasePaginatedResponse, TRequest, TResponse } from "definations/auth";
import baseAPI from "..";
import {
    TSupervisionPlanPaginatedData,
    TSSPCompositionFormValues,
    TSupervisionPlanSingleData,
} from "definations/program-types/ssp";

const BASE_URL = "/programs/plans/supportive-supervision/";

const SSPAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createSupervisionPlan: builder.mutation<
            TBasePaginatedResponse<TSupervisionPlanPaginatedData>,
            TSSPCompositionFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
        }),

        getAllSupervisionPlan: builder.query<
            TBasePaginatedResponse<TSupervisionPlanPaginatedData>,
            TRequest
        >({
            query: () => ({
                method: "GET",
                url: BASE_URL,
            }),
        }),

        getSingleSupervisionPlan: builder.query<
            TResponse<TSupervisionPlanSingleData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}`,
            }),
        }),
    }),
});

export const {
    useCreateSupervisionPlanMutation,
    useGetAllSupervisionPlanQuery,
    useGetSingleSupervisionPlanQuery,
} = SSPAPI;
