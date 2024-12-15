import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
    TCostCategoryData,
    TCostCategoryFormValues,
} from "definations/modules/finance/cost-category";
import baseAPI from "services/index";

const CostCategoryAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getAllCostCategories: builder.query<
            TPaginatedResponse<TCostCategoryData>,
            TRequest
        >({
            query: (params) => ({
                method: "GET",
                url: "/finance/cost-categories/",
                params,
            }),
            providesTags: ["Cost_Category"],
        }),

        getSingleCostCategory: builder.query<
            TResponse<TCostCategoryData>,
            string
        >({
            query: (id) => ({
                method: "GET",
                url: `/finance/cost-categories/${id}/`,
            }),
        }),

        addCostCategory: builder.mutation<
            TResponse<TCostCategoryData>,
            TCostCategoryFormValues
        >({
            query: (body) => ({
                method: "POST",
                url: "/finance/cost-categories/",
                body,
            }),
            invalidatesTags: ["Cost_Category"],
        }),

        updateCostCategory: builder.mutation<
            TResponse<TCostCategoryData>,
            { id: number; body: TCostCategoryFormValues }
        >({
            query: ({ id, body }) => ({
                method: "PUT",
                url: `/finance/cost-categories/${id}/`,
                body,
            }),
            invalidatesTags: ["Cost_Category"],
        }),

        deleteCostCategory: builder.mutation<
            TResponse<TCostCategoryData>,
            string
        >({
            query: (id) => ({
                method: "DELETE",
                url: `/finance/cost-categories/${id}/`,
            }),
            invalidatesTags: ["Cost_Category"],
        }),
    }),
});

export const {
    useGetAllCostCategoriesQuery,
    useGetSingleCostCategoryQuery,
    useAddCostCategoryMutation,
    useUpdateCostCategoryMutation,
    useDeleteCostCategoryMutation,
} = CostCategoryAPI;
