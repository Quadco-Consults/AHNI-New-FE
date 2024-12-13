import baseAPI from "services/index";

import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TRiskCategoryData,
    TRiskCategoryFormValues,
} from "definations/modules/program/risk-category";

const RiskCategoryAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllRiskCategory: builder.query<
            TPaginatedResponse<TRiskCategoryData>,
            TRequest
        >({
            query: (params) => ({
                url: "/programs/risk-category/",
                params,
            }),
            providesTags: ["RiskCategory"],
        }),

        addRiskCategory: builder.mutation<
            TResponse<TRiskCategoryData>,
            TRiskCategoryFormValues
        >({
            query: (body) => ({
                url: "/programs/risk-category/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["RiskCategory"],
        }),

        updateRiskCategory: builder.mutation<
            TResponse<TRiskCategoryData>,
            { id: string; body: TRiskCategoryFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/programs/risk-category/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["RiskCategory"],
        }),

        deleteRiskCategory: builder.mutation<
            TResponse<TRiskCategoryData>,
            string
        >({
            query: (id) => ({
                url: `/programs/risk-category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RiskCategory"],
        }),
    }),
});

export const {
    useGetAllRiskCategoryQuery,
    useAddRiskCategoryMutation,
    useUpdateRiskCategoryMutation,
    useDeleteRiskCategoryMutation,
} = RiskCategoryAPI;
