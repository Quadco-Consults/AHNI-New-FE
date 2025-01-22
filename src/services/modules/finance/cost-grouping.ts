import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TCostInputData,
  TCostInputFormValues,
} from "definations/modules/finance/cost-input";
import baseAPI from "services/index";

const CostGroupingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllCostGroupings: builder.query<
      TPaginatedResponse<TCostInputData>,
      TRequest
    >({
      query: (params) => ({
        method: "GET",
        url: "/finance/cost-grouping/",
        params,
      }),
      //   providesTags: ["Cost_Grouping"],
    }),

    addCostGrouping: builder.mutation<
      TResponse<TCostInputData>,
      TCostInputFormValues
    >({
      query: (body) => ({
        method: "POST",
        url: "/finance/cost-grouping/",
        body,
      }),
      //   invalidatesTags: ["Cost_Grouping"],
    }),

    updateCostGrouping: builder.mutation<
      TResponse<TCostInputData>,
      { id: number; body: TCostInputFormValues }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/finance/cost-grouping/${id}/`,
        body,
      }),
      //   invalidatesTags: ["Cost_Grouping"],
    }),

    deleteCostGrouping: builder.mutation<TResponse<TCostInputData>, string>({
      query: (id) => ({
        method: "DELETE",
        url: `/finance/cost-grouping/${id}/`,
      }),
      //   invalidatesTags: ["Cost_Grouping"],
    }),
  }),
});

export const {
  useGetAllCostGroupingsQuery,
  useAddCostGroupingMutation,
  useUpdateCostGroupingMutation,
  useDeleteCostGroupingMutation,
} = CostGroupingAPI;
