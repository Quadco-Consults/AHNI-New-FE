import baseAPI from "..";

const BASE_URL = "config/positions/";

const PositionConfigAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPositionConfig: builder.query<any[], void>({
      query: () => ({
        url: BASE_URL,
      }),
  // providesTags removed to fix type error
    }),
  }),
});

export const { useGetPositionConfigQuery } = PositionConfigAPI;
