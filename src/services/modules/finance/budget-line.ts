import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TBudgetLineData,
  TBudgetLineFormValues,
} from "definations/modules/finance/budget-line";
import baseAPI from "services/index";

const BudgetLineAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllBudgetLines: builder.query<
      TPaginatedResponse<TBudgetLineData>,
      TRequest
    >({
      query: (params) => ({
        method: "GET",
        url: "/finance/budget-lines/",
        params,
      }),
      providesTags: ["BudgetLine"],
    }),

    addBudgetLine: builder.mutation<
      TResponse<TBudgetLineData>,
      TBudgetLineFormValues
    >({
      query: (body) => ({
        method: "POST",
        url: "/finance/budget-lines/",
        body,
      }),
      invalidatesTags: ["BudgetLine"],
    }),

    updateBudgetLine: builder.mutation<
      TResponse<TBudgetLineData>,
      { id: number; body: TBudgetLineFormValues }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/finance/budget-lines/${id}/`,
        body,
      }),
      invalidatesTags: ["BudgetLine"],
    }),
    getSingleBudgetLine: builder.query<TResponse<TBudgetLineData>, string>({
      query: (id) => ({
        method: "GET",
        url: `/finance/budget-lines/${id}/`,
      }),
      providesTags: ["BudgetLine"],
    }),
    deleteBudgetLine: builder.mutation<TResponse<TBudgetLineData>, string>({
      query: (id) => ({
        method: "DELETE",
        url: `/finance/budget-lines/${id}/`,
      }),
      invalidatesTags: ["BudgetLine"],
    }),
  }),
});

export const {
  useGetAllBudgetLinesQuery,
  useAddBudgetLineMutation,
  useUpdateBudgetLineMutation,
  useDeleteBudgetLineMutation,
  useGetSingleBudgetLineQuery, // Updated from mutation to query
} = BudgetLineAPI;
