import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TPositionData,
  TPositionFormValues,
} from "definations/modules/config/position";
import baseAPI from "services/index";

const PositionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addPosition: builder.mutation<
      TResponse<TPositionData>,
      TPositionFormValues
    >({
      query: (body) => ({
        method: "POST",
        url: `/config/positions/`,
        body,
      }),
      invalidatesTags: ["Position"],
    }),

    getAllPositions: builder.query<TPaginatedResponse<TPositionData>, TRequest>(
      {
        query: (params) => ({
          method: "GET",
          url: "/config/positions/",
          params,
        }),
        providesTags: ["Position"],
      }
    ),

    updatePosition: builder.mutation<
      TResponse<TPositionData>,
      { id: string; body: TPositionFormValues }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/config/positions/${id}/`,
        body,
      }),
      invalidatesTags: ["Position"],
    }),

    deletePosition: builder.mutation<TResponse<TPositionData>, string>({
      query: (id) => ({
        method: "DELETE",
        url: `/config/positions/${id}/`,
      }),
      invalidatesTags: ["Position"],
    }),
  }),
});

export const {
  useAddPositionMutation,
  useGetAllPositionsQuery,
  useUpdatePositionMutation,
  useDeletePositionMutation,
} = PositionAPI;
