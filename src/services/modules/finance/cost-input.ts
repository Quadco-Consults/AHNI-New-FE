import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TCostInputData,
  TCostInputFormValues,
} from "definations/modules/finance/cost-input";
import baseAPI from "services/index";

const CostInputAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllCostInputs: builder.query<
      TPaginatedResponse<TCostInputData>,
      TRequest
    >({
      query: (params) => ({
        method: "GET",
        url: "/finance/cost-inputs/",
        params,
      }),
      providesTags: ["Cost_Input"],
    }),

    getSingleCostInput: builder.query<TResponse<TCostInputData>, string>({
      query: (id) => ({
        method: "GET",
        url: `/finance/cost-inputs/${id}/`,
      }),
      providesTags: ["Cost_Input"],
    }),

    addCostInput: builder.mutation<
      TResponse<TCostInputData>,
      TCostInputFormValues
    >({
      query: (body) => ({
        method: "POST",
        url: "/finance/cost-inputs/",
        body,
      }),
      invalidatesTags: ["Cost_Input"],
    }),

    updateCostInput: builder.mutation<
      TResponse<TCostInputData>,
      { id: number; body: TCostInputFormValues }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/finance/cost-inputs/${id}/`,
        body,
      }),
      invalidatesTags: ["Cost_Input"],
    }),

    deleteCostInput: builder.mutation<TResponse<TCostInputData>, string>({
      query: (id) => ({
        method: "DELETE",
        url: `/finance/cost-inputs/${id}/`,
      }),
      invalidatesTags: ["Cost_Input"],
    }),
  }),
});

export const {
  useGetAllCostInputsQuery,
  useAddCostInputMutation,
  useUpdateCostInputMutation,
  useDeleteCostInputMutation,
  useGetSingleCostInputQuery,
} = CostInputAPI;
