import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import {
  TPositionData,
  TPositionFormValues,
} from "definations/modules/config/position";
import baseAPI from "services/index";

const GradeAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addGrade: builder.mutation<TResponse<TPositionData>, TPositionFormValues>({
      query: (body) => ({
        method: "POST",
        url: `/config/grade/`,
        body,
      }),
      invalidatesTags: ["GRADE"],
    }),

    getAllGrades: builder.query<TPaginatedResponse<TPositionData>, TRequest>({
      query: (params) => ({
        method: "GET",
        url: "/config/grade/",
        params,
      }),
      providesTags: ["GRADE"],
    }),

    updateGrade: builder.mutation<
      TResponse<TPositionData>,
      { id: string; body: TPositionFormValues }
    >({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/config/grade/${id}/`,
        body,
      }),
      invalidatesTags: ["GRADE"],
    }),

    deleteGrade: builder.mutation<TResponse<TPositionData>, string>({
      query: (id) => ({
        method: "DELETE",
        url: `/config/grade/${id}/`,
      }),
      invalidatesTags: ["GRADE"],
    }),
  }),
});

export const {
  useAddGradeMutation,
  useGetAllGradesQuery,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} = GradeAPI;
