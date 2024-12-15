import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TChartAccountData,
    TChartAccountFormValues,
} from "definations/modules/finance/chart-account";
import baseAPI from "services/index";

const ChartAccountAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllChartAccounts: builder.query<
            TPaginatedResponse<TChartAccountData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/charts-of-accounts/",
                params,
            }),
            providesTags: ["ChartAccount"],
        }),

        addChartAccount: builder.mutation<
            TResponse<TChartAccountData>,
            TChartAccountFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/finance/charts-of-accounts/",
                body,
            }),
            invalidatesTags: ["ChartAccount"],
        }),

        updateChartAccount: builder.mutation<
            TResponse<TChartAccountData>,
            { id: number; body: TChartAccountFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/charts-of-accounts/${id}/`,
                body,
            }),
            invalidatesTags: ["ChartAccount"],
        }),

        deleteChartAccount: builder.mutation<
            TResponse<TChartAccountData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/charts-of-accounts/${id}/`,
            }),
            invalidatesTags: ["ChartAccount"],
        }),
    }),
});

export const {
    useGetAllChartAccountsQuery,
    useAddChartAccountMutation,
    useUpdateChartAccountMutation,
    useDeleteChartAccountMutation,
} = ChartAccountAPI;
