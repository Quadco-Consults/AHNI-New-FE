import { Interview } from "definations/hr-types/interview";
import baseAPI from "..";

const BASE_URL = "hr/jobs/interviews/";

const InterviewAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getInterviews: builder.query<
      Interview[],
      { status?: string; search?: string }
    >({
      query: ({ status, search }) => ({
        url: BASE_URL,
        params: {
          ...(status && { status }), // Include status if provided
          ...(search && { search }), // Include search if provided
        },
      }),
      providesTags: ["INTERVIEWS"],
    }),

    getInterview: builder.query<Interview, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["INTERVIEWS"],
    }),
    createInterview: builder.mutation<
      { status: string; message: string; data: Interview },
      Partial<Interview>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["INTERVIEWS"],
    }),
  }),
});

export const {
  useCreateInterviewMutation,
  useGetInterviewQuery,
  useGetInterviewsQuery,
} = InterviewAPI;
