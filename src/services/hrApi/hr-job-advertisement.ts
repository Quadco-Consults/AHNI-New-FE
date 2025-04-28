import {
  JobAdvertisement,
  JobAdvertisementModel,
} from "definations/hr-types/job-advertisement";
import baseAPI from "..";

const BASE_URL = "hr/jobs/advertisements/";

const JobAdvertisementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getJobAdvertisements: builder.query<
      JobAdvertisement[],
      { search?: string }
    >({
      query: ({ search }) => ({
        url: BASE_URL,
        params: { ...(search && { search }) },
      }),
      providesTags: ["JOB_ADVERTISEMENTS"],
    }),

    getJobAdvertisement: builder.query<JobAdvertisementModel, { id: string }>({
      query: ({ id }) => ({ url: `${BASE_URL}${id}/` }),
      providesTags: ["JOB_ADVERTISEMENTS"],
    }),

    createJobAdvertisement: builder.mutation<
      JobAdvertisement,
      Partial<JobAdvertisement>
    >({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JOB_ADVERTISEMENTS"],
    }),

    updateJobAdvertisement: builder.mutation<
      JobAdvertisement,
      { id: string; body: Partial<JobAdvertisement> }
    >({
      query: ({ id, body }) => ({
        url: `${BASE_URL}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["JOB_ADVERTISEMENTS"],
    }),
  }),
});

export const {
  useCreateJobAdvertisementMutation,
  useGetJobAdvertisementQuery,
  useGetJobAdvertisementsQuery,
  useUpdateJobAdvertisementMutation,
} = JobAdvertisementAPI;
