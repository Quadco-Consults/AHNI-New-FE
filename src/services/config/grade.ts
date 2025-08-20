import baseAPI from "..";

const BASE_URL = "config/grade/";

const GradeConfigAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGradeConfig: builder.query<any[], void>({
      query: () => ({
        url: BASE_URL,
      }),
  // providesTags removed to fix type error
    }),
  }),
});

export const { useGetGradeConfigQuery } = GradeConfigAPI;
