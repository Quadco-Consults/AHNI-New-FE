import { TPaginatedResponse, TRequest } from "definations/index";
import baseAPI from "../..";
import {
    TFundingSourceFormValues,
    TFundingSourceResponse,
} from "definations/modules/project/funding-source";

const projectsAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        useGetAllFundingSource: builder.query<
            TPaginatedResponse<TFundingSourceResponse>,
            TRequest
        >({
            query: (params) => ({
                url: "/projects/funding-sources/",
                params,
            }),
            providesTags: ["FundingSource"],
        }),

        addFundingSource: builder.mutation<
            TFundingSourceResponse,
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
            TFundingSourceResponse,
            { id: string; body: TFundingSourceFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/projects/funding-sources/${id}/`,
                method: "PUT",
                body: body,
            }),
            invalidatesTags: ["FundingSource"],
        }),

        deleteFundingSource: builder.mutation<TFundingSourceResponse, string>({
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
} = projectsAPI;
