import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TPrequalificationCategoryData,
    TPrequalificationCategoryFormValues,
} from "definations/modules/procurement/prequalification-category";
import baseAPI from "services/index";

const PrequalificationCategoryAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllPrequalificationCategory: builder.query<
            TPaginatedResponse<TPrequalificationCategoryData>,
            TRequest
        >({
            query: (params) => ({
                url: "/procurements/prequalification_category/",
                params,
            }),
            providesTags: ["PrequalificationCategory"],
        }),

        addPrequalificationCategory: builder.mutation<
            TResponse<TPrequalificationCategoryData>,
            TPrequalificationCategoryFormValues
        >({
            query: (body) => ({
                url: "/procurements/prequalification_category/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["PrequalificationCategory"],
        }),

        updatePrequalificationCategory: builder.mutation<
            TResponse<TPrequalificationCategoryData>,
            { id: string; body: TPrequalificationCategoryFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/procurements/prequalification_category/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["PrequalificationCategory"],
        }),

        deletePrequalificationCategory: builder.mutation<
            TResponse<TPrequalificationCategoryData>,
            string
        >({
            query: (id) => ({
                url: `/procurements/prequalification_category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PrequalificationCategory"],
        }),
    }),
});

export const {
    useGetAllPrequalificationCategoryQuery,
    useAddPrequalificationCategoryMutation,
    useUpdatePrequalificationCategoryMutation,
    useDeletePrequalificationCategoryMutation,
} = PrequalificationCategoryAPI;
