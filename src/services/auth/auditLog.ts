// import baseAPI from "..";

// const AuditLogAPI = baseAPI.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllActivites: builder.query({
//       query: (params) => ({
//         url: "/activities/",
//         params,
//       }),
//       providesTags: ["ACTIVITIES"],
//     }),
//   }),

// });

// export const { useGetAllActivitesQuery } = AuditLogAPI;
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

    downloadActivities: builder.mutation<Blob, any>({
      // @ts-ignore
      queryFn: async (args, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const result = await fetchWithBQ({
            url: "/activities/download/",
            method: "GET",
            params: args,
            responseHandler: async (response) => await response.blob(), // <-- Important
          });

          if (result.error) {
            throw result.error;
          }

          return { data: result.data as Blob };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetAllActivitesQuery, useDownloadActivitiesMutation } =
  AuditLogAPI;
