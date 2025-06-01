import {
  PerformanceAssesment,
  PerformanceAssesmentModel,
} from "definations/hr-types/performance-assesment";
import baseAPI from "..";

const BASE_URL = "hr/performance/assessments/";

const PerformanceAssesmentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPerformanceAssesments: builder.query<
      PerformanceAssesment[],
      { search?: string }
    >({
      query: ({ search }) => ({
        url: BASE_URL,
        params: { ...(search && { search }) },
      }),
      providesTags: ["PERFORMANCE_ASSESMENST"],
    }),

    getPerformanceAssesment: builder.query<
      PerformanceAssesmentModel,
      { id: string }
    >({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["PERFORMANCE_ASSESMENST"],
    }),

    createPerformanceAssesment: builder.mutation<
      PerformanceAssesment,
      Partial<PerformanceAssesment>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PERFORMANCE_ASSESMENST"],
    }),

    updatePerformanceAssesment: builder.mutation<
      PerformanceAssesment,
      { id: string; body: Partial<PerformanceAssesment> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PERFORMANCE_ASSESMENST"],
    }),
  }),
});

export const {
  useCreatePerformanceAssesmentMutation,
  useGetPerformanceAssesmentQuery,
  useGetPerformanceAssesmentsQuery,
  useUpdatePerformanceAssesmentMutation,
} = PerformanceAssesmentAPI;
