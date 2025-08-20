import baseAPI from "..";

const BASE_URL = "config/locations/";

const LocationConfigAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLocationConfig: builder.query<any[], void>({
      query: () => ({
        url: BASE_URL,
      }),
  // providesTags removed to fix type error
    }),
  }),
});

export const { useGetLocationConfigQuery } = LocationConfigAPI;
