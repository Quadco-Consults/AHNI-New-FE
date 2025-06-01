import baseAPI from "..";

const AuditLogAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllActivites: builder.query({
      query: (params) => ({
        url: "/activities/",
        params,
      }),
      providesTags: ["ACTIVITIES"],
    }),
  }),
});

export const { useGetAllActivitesQuery } = AuditLogAPI;
