import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";

const BASE_URL = "/contract-grants/grants/";

export const grantsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGrants: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL}`,
        ...config,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("GRANTS", data) : []),
    }),
    getGrantById: builder.query<any, any>({
      query: (id) => ({
        url: `${BASE_URL + id}`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags("GRANTS", data) : []),
    }),
    addNewGrant: builder.mutation<any, any>({
      query: (body) => ({
        url: `${BASE_URL}`,
        body,
        method: "POST",
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags("GRANTS", data) : []),
    }),
  }),
});
