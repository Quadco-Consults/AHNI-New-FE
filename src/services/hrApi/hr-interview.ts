import { Interview } from "definations/hr-types/interview";
import baseAPI from "..";

const BASE_URL = "hr/interview/";

const InterviewAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
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

export default InterviewAPI;
