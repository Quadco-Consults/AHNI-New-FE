import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TPositionData,
  TPositionFormValues,
} from "definations/modules/config/position";
import baseAPI from "services/index";

const LevelAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addLevel: builder.mutation<TResponse<TPositionData>, TPositionFormValues>({
      query: (body) => ({
        method: "POST",
        url: `/config/level/`,
        body,
      }),
      invalidatesTags: ["LEVEL"],
    }),

    getAllLevels: builder.query<TPaginatedResponse<TPositionData>, TRequest>({
      query: (params) => ({
        method: "GET",
        url: "/config/level/",
        params,
      }),
      providesTags: ["LEVEL"],
    }),

    updateLevel: builder.mutation<
      TResponse<TPositionData>,
      { id: string; body: TPositionFormValues }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/config/level/${id}/`,
        body,
      }),
      invalidatesTags: ["LEVEL"],
    }),

    deleteLevel: builder.mutation<TResponse<TPositionData>, string>({
      query: (id) => ({
        method: "DELETE",
        url: `/config/level/${id}/`,
      }),
      invalidatesTags: ["LEVEL"],
    }),
  }),
});

export const {
  useAddLevelMutation,
  useGetAllLevelsQuery,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
} = LevelAPI;
