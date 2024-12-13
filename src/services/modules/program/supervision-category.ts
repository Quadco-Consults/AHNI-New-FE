import baseAPI from "services/index";

import { TPaginatedResponse, TRequest } from "definations/index";
import {
    TSupervisionCategoryData,
    TSupervisionCategoryFormValues,
} from "definations/modules/program/supervision-category";

const SupervisionCategoryAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupervisionCategory: builder.query<
            TPaginatedResponse<TSupervisionCategoryData>,
            TRequest
        >({
            query: (params) => ({
                url: "/programs/supervision-evaluation-category/",
                params,
            }),
            providesTags: ["SupervisionCategory"],
        }),

        addSupervisionCategory: builder.mutation<
            TSupervisionCategoryData,
            TSupervisionCategoryFormValues
        >({
            query: (body) => ({
                url: "/programs/supervision-evaluation-category/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["SupervisionCategory"],
        }),

        updateSupervisionCategory: builder.mutation<
            TSupervisionCategoryData,
            { id: string; body: TSupervisionCategoryFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/programs/supervision-evaluation-category/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["SupervisionCategory"],
        }),

        deleteSupervisionCategory: builder.mutation<
            TSupervisionCategoryData,
            string
        >({
            query: (id) => ({
                url: `/programs/supervision-evaluation-category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SupervisionCategory"],
        }),
    }),
});

export const {
    useGetAllSupervisionCategoryQuery,
    useAddSupervisionCategoryMutation,
    useUpdateSupervisionCategoryMutation,
    useDeleteSupervisionCategoryMutation,
} = SupervisionCategoryAPI;
