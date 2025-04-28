import { JobApplication } from "definations/hr-types/job-application";
import baseAPI from "..";

const BASE_URL = "hr/jobs/applications/";

const JobApplicationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getJobApplications: builder.query<
      JobApplication[],
      { status?: string; search?: string; id?: string }
    >({
      query: ({ status, search, id }) => ({
        url: BASE_URL,
        params: {
          advertisement: id,
          ...(status && { status }), // Include status if provided
          ...(search && { search }), // Include search if provided
        },
      }),
      providesTags: ["JOB_APPLICATIONS"],
    }),

    getJobApplication: builder.query<JobApplication, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["JOB_APPLICATIONS"],
    }),

    createJobApplication: builder.mutation<
      JobApplication,
      Partial<JobApplication>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JOB_APPLICATIONS"],
    }),

    updateJobApplication: builder.mutation<
      JobApplication,
      { id: string; body: Partial<JobApplication> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["JOB_APPLICATIONS"],
    }),

    patchJobApplication: builder.mutation<
      JobApplication,
      { id: string; body: Partial<JobApplication> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["JOB_APPLICATIONS"],
    }),
    patchJobApplicationShortlisted: builder.mutation<
      JobApplication,
      { id: string; body: Partial<JobApplication> }
    >({
      query: ({ id, body }) => ({
        url: `hr/jobs/applications/${id}/shortlist/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["JOB_APPLICATIONS"],
    }),
    patchJobApplicationAccepted: builder.mutation<
      JobApplication,
      { id: string; body: Partial<JobApplication> }
    >({
      query: ({ id, body }) => ({
        url: `hr/jobs/applications/${id}/accept/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["JOB_APPLICATIONS"],
    }),
    patchJobApplicationPreferred: builder.mutation<
      JobApplication,
      { id: string; body: Partial<JobApplication> }
    >({
      query: ({ id, body }) => ({
        url: `hr/jobs/applications/${id}/mark-as-preferred/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["JOB_APPLICATIONS"],
    }),
  }),
});

export const {
  useCreateJobApplicationMutation,
  useGetJobApplicationQuery,
  useGetJobApplicationsQuery,
  useUpdateJobApplicationMutation,
  usePatchJobApplicationMutation,
  usePatchJobApplicationShortlistedMutation,
  usePatchJobApplicationAcceptedMutation,
  usePatchJobApplicationPreferredMutation,
} = JobApplicationAPI;
