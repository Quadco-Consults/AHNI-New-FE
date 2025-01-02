import baseAPI from "services/index";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TCategoryData,
    TCategoryFormValues,
} from "definations/modules/config/category";

const CategoryAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<
            TPaginatedResponse<TCategoryData>,
            TRequest
        >({
            query: (params) => ({
                url: "/config/category/",
                params,
            }),
            providesTags: ["Categories"],
        }),

        addCategory: builder.mutation<
            TResponse<TCategoryData>,
            TCategoryFormValues
        >({
            query: (body) => ({
                url: "/config/category/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Categories"],
        }),

        updateCategory: builder.mutation<
            TResponse<TCategoryData>,
            { id: string; body: TCategoryFormValues }
        >({
            query: ({ id, body }) => ({
                url: `/config/category/${id}/`,
                method: "PATCH",
                body: body,
            }),
            invalidatesTags: ["Categories"],
        }),

        deleteCategory: builder.mutation<TResponse<TCategoryData>, string>({
            query: (id) => ({
                url: `/config/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = CategoryAPI;
