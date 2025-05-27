import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import baseAPI from "../..";
import {
    TFundingSourceData,
    TFundingSourceFormValues,
} from "definations/modules/project/funding-source";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        useGetAllFundingSource: builder.query<
            TPaginatedResponse<TFundingSourceData>,
            TRequest
        >({
            query: (params) => ({
                url: "/projects/funding-sources/",
                params,
            }),
            providesTags: ["FundingSource"],
        }),

        getSingleFundingSource: builder.query<
            TResponse<TFundingSourceData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/projects/funding-sources/${id}/`,
            }),
            providesTags: ["FundingSource"],
        }),
        addFundingSource: builder.mutation<
            TResponse<TFundingSourceData>,
            TFundingSourceFormValues
        >({
            query: (body) => ({
                url: "/projects/funding-sources/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["FundingSource"],
        }),

        updateFundingSource: builder.mutation<
            TResponse<TFundingSourceData>,
            { id: string; body: TFundingSourceFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/projects/funding-sources/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["FundingSource"],
        }),

        deleteFundingSource: builder.mutation<
            TResponse<TFundingSourceData>,
            string
        >({
            query: (id) => ({
                url: `/projects/funding-sources/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FundingSource"],
        }),
    }),
});

export const {
    useUseGetAllFundingSourceQuery,
    useAddFundingSourceMutation,
    useDeleteFundingSourceMutation,
    useUpdateFundingSourceMutation,
    useGetSingleFundingSourceQuery,
} = projectsAPI;
