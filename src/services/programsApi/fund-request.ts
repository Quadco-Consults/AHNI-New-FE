import baseAPI from "..";
import {
    TFundRequestPaginatedResponse,
    TFundRequestResponseData,
} from "definations/program-types/fund-request";
import { TRequest, TResponse } from "definations/auth/auth";
import { TFundRequestFormValues } from "definations/program-validator";

const BASE_URL = "/programs/fund-requests/";

const FundRequestAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        createFundRequest: builder.mutation<null, TFundRequestFormValues>({
            query: (body) => ({
                method: "POST",
                url: BASE_URL,
                body,
            }),
            invalidatesTags: ["FUND_REQUEST"],
        }),

        getAllFundRequests: builder.query<
            TFundRequestPaginatedResponse,
            TRequest & { project: string }
        >({
            query: (params) => {
                return {
                    url: `${BASE_URL}`,
                    params,
                };
            },
            providesTags: ["FUND_REQUEST"],
        }),

        getSingleFundRequest: builder.query<
            TResponse<TFundRequestResponseData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `${BASE_URL}${id}/`,
            }),
        }),

        deleteFundRequest: builder.mutation<null, string>({
            query: (id) => ({
                method: "DELETE",
                url: `${BASE_URL}${id}/`,
            }),
            invalidatesTags: ["FUND_REQUEST"],
        }),
    }),
});

export const {
    useGetAllFundRequestsQuery,
    useGetSingleFundRequestQuery,
    useCreateFundRequestMutation,
    useDeleteFundRequestMutation,
} = FundRequestAPI;
