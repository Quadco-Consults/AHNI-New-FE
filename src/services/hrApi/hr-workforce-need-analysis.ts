import { WorkforceNeedAnalysis } from "definations/hr-types/hr-workforce-need-analysis";
import baseAPI from "..";

const BASE_URL = "hr/employees/workforce/need-analysis/";

const WorkforceNeedAnalysisAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWorkforceNeedAnalysis: builder.query<
      WorkforceNeedAnalysis[],
      { search?: string; location?: string; position?: string }
    >({
      query: ({ search, location, position }) => ({
        url: BASE_URL,
        params: {
          ...(search && { search }),
          ...(location && { location }),
          ...(position && { position }),
        },
      }),
      providesTags: ["WORKFORCE_NEED_ANALYSIS"],
    }),

    getWorkforceNeedAnalysisId: builder.query<
      WorkforceNeedAnalysis,
      { id: string }
    >({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["WORKFORCE_NEED_ANALYSIS"],
    }),

    createWorkforceNeedAnalysis: builder.mutation<
      WorkforceNeedAnalysis,
      Partial<WorkforceNeedAnalysis>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["WORKFORCE_NEED_ANALYSIS"],
    }),
  }),
});

export const {
  useCreateWorkforceNeedAnalysisMutation,
  useGetWorkforceNeedAnalysisIdQuery,
  useGetWorkforceNeedAnalysisQuery,
} = WorkforceNeedAnalysisAPI;
