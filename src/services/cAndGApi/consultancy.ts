import { invalidateTags, provideTags } from "utils/QueryUtils";
import baseAPI from "..";

const BASE_URL_APPLICATIONS = "contract-grants/consultancy-details/";
const BASE_URL_SCOPES = "contract-grants/consultancy-scopes/";
const TAG = "CONSULTANCY";

export const consultancyAPIs = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllConsultancy: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL_APPLICATIONS}`,
        method: "GET",
        ...config,
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    getSingleConsultancy: builder.query<any, any>({
      query: (id) => ({
        url: `${BASE_URL_APPLICATIONS}${id}`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    addConsultancyDetails: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL_APPLICATIONS}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),
    // scopes
    getAllConsultancyScope: builder.query<any, any>({
      query: (config) => ({
        url: `${BASE_URL_SCOPES}`,
        method: "GET",
        ...config,
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    getSingleConsultancyScope: builder.query<any, any>({
      query: (id) => ({
        url: `${BASE_URL_SCOPES}${id}`,
        method: "GET",
      }),
      providesTags: (data, error) => (!error ? provideTags(TAG, data) : []),
    }),
    addConsultancyScopeDetails: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL_SCOPES}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, data, error) => (!error ? invalidateTags(TAG, data) : []),
    }),
  }),
});
