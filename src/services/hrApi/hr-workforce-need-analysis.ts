import { WorkforceNeedAnalysis } from "definations/hr-types/hr-workforce-need-analysis";
import baseAPI from "..";

const BASE_URL = "hr/employees/workforce/need-analysis/";

const WorkforceNeedAnalysisAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWorkforceNeedAnalysis: builder.query<
    WorkforceNeedAnalysis[],
      { status?: string; search?: string }
    >({
      query: ({ status, search }) => ({
        url: BASE_URL,
        params: {
          ...(status && { status }),
          ...(search && { search }),
        },
      }),
      providesTags: ["WORKFORCE_NEED_ANALYSIS"],
    }),

    getWorkforceNeedAnalysisId: builder.query<WorkforceNeedAnalysis, { id: string }>({
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
  useGetWorkforceNeedAnalysisQuery
} = WorkforceNeedAnalysisAPI;
